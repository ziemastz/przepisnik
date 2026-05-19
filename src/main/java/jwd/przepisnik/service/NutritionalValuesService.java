package jwd.przepisnik.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.web.response.NutritionalValuesResponse;

@Service
public class NutritionalValuesService {

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

    public NutritionalValuesResponse calculatePerServing(NutritionalValuesResponse total, int servings) {
        if (servings <= 0) {
            return total;
        }
        BigDecimal divisor = BigDecimal.valueOf(servings);
        return new NutritionalValuesResponse(
                total.protein().divide(divisor, 2, RoundingMode.HALF_UP),
                total.fat().divide(divisor, 2, RoundingMode.HALF_UP),
                total.carbohydrates().divide(divisor, 2, RoundingMode.HALF_UP));
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
