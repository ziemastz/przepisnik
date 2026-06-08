package jwd.przepisnik.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.web.response.NutritionalValuesResponse;
import jwd.przepisnik.web.response.ZoRating;

@Service
public class NutritionalValuesService {

    private static final BigDecimal FAT_THRESHOLD = new BigDecimal("2.5");
    private static final BigDecimal CARBOHYDRATE_THRESHOLD = new BigDecimal("0.8");
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private static final BigDecimal GOOD_THRESHOLD = new BigDecimal("70");
    private static final BigDecimal IDEAL_THRESHOLD = new BigDecimal("90");
    private static final BigDecimal AVERAGE_THRESHOLD = new BigDecimal("40");

    private final IngredientUnitConversionService ingredientUnitConversionService;

    public NutritionalValuesService(IngredientUnitConversionService ingredientUnitConversionService) {
        this.ingredientUnitConversionService = ingredientUnitConversionService;
    }

    public NutritionalValuesResponse calculateForIngredient(RecipeIngredient recipeIngredient) {
        Ingredient ingredient = recipeIngredient.getIngredient();

        BigDecimal protein = orZero(ingredient.getProtein());
        BigDecimal fat = orZero(ingredient.getFat());
        BigDecimal carbohydrates = orZero(ingredient.getCarbohydrates());

        BigDecimal grams = getIngredientWeightInGrams(recipeIngredient, ingredient);

        BigDecimal factor = grams.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

        return new NutritionalValuesResponse(
                protein.multiply(factor).setScale(2, RoundingMode.HALF_UP),
                fat.multiply(factor).setScale(2, RoundingMode.HALF_UP),
                carbohydrates.multiply(factor).setScale(2, RoundingMode.HALF_UP));
    }

    public NutritionalValuesResponse calculateTotal(List<RecipeIngredient> ingredients) {
        return ingredients.stream()
                .map(this::calculateForIngredient)
                .reduce(
                        new NutritionalValuesResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO),
                        this::sum);
    }

    public NutritionalValuesResponse calculateTotalFromValues(List<NutritionalValuesResponse> nutritionalValues) {
        return nutritionalValues.stream()
                .reduce(
                        new NutritionalValuesResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO),
                        this::sum);
    }

    public NutritionalValuesResponse calculatePerProtein(NutritionalValuesResponse total) {
        BigDecimal divisor = total.protein();
        if (divisor.compareTo(BigDecimal.ZERO) == 0) {
            return new NutritionalValuesResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        return new NutritionalValuesResponse(
                total.protein().divide(divisor, 2, RoundingMode.HALF_UP),
                total.fat().divide(divisor, 2, RoundingMode.HALF_UP),
                total.carbohydrates().divide(divisor, 2, RoundingMode.HALF_UP));
    }

    public BigDecimal calculateZo(NutritionalValuesResponse total) {
        if (total.protein().compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        NutritionalValuesResponse perProtein = calculatePerProtein(total);

        BigDecimal fatScope = perProtein.fat()
                .divide(FAT_THRESHOLD, 4, RoundingMode.HALF_UP)
                .min(BigDecimal.ONE);

        BigDecimal carbScope = perProtein.carbohydrates().compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ONE
                : CARBOHYDRATE_THRESHOLD
                        .divide(perProtein.carbohydrates(), 4, RoundingMode.HALF_UP)
                        .min(BigDecimal.ONE);

        return fatScope
                .add(carbScope)
                .divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP)
                .multiply(ONE_HUNDRED)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public ZoRating evaluateZo(BigDecimal zo) {
        if (zo.compareTo(IDEAL_THRESHOLD) >= 0) {
            return ZoRating.IDEAL;
        }

        if (zo.compareTo(GOOD_THRESHOLD) >= 0) {
            return ZoRating.GOOD;
        }

        if (zo.compareTo(AVERAGE_THRESHOLD) >= 0) {
            return ZoRating.AVERAGE;
        }

        return ZoRating.POOR;
    }

    private BigDecimal getIngredientWeightInGrams(RecipeIngredient recipeIngredient, Ingredient ingredient) {
        if (recipeIngredient.getUnit() == IngredientUnit.PIECE && ingredient.getPortion() == null) {
            return BigDecimal.ZERO;
        }
        return ingredientUnitConversionService.convertToGrams(
                recipeIngredient.getQuantity(),
                recipeIngredient.getUnit(),
                ingredient.getPortion());
    }

    private NutritionalValuesResponse sum(NutritionalValuesResponse a, NutritionalValuesResponse b) {
        return new NutritionalValuesResponse(
                a.protein().add(b.protein()),
                a.fat().add(b.fat()),
                a.carbohydrates().add(b.carbohydrates()));
    }

    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
