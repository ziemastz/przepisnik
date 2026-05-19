package jwd.przepisnik.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.web.response.NutritionalValuesResponse;

@ExtendWith(MockitoExtension.class)
class NutritionalValuesServiceTest {

    @Mock
    private IngredientUnitConversionService ingredientUnitConversionService;

    @InjectMocks
    private NutritionalValuesService nutritionalValuesService;

    // --- calculateForIngredient ---

    @Test
    void calculateForIngredientShouldScaleBtwByGramFactor() {
        // Ingredient: 20g protein, 5g fat, 10g carbs per 100g
        // Quantity: 200 GRAM  →  factor = 2.0
        RecipeIngredient ri = buildIngredient(
                new BigDecimal("20.00"), new BigDecimal("5.00"), new BigDecimal("10.00"), null,
                new BigDecimal("200.00"), IngredientUnit.GRAM);

        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("200.00"), IngredientUnit.GRAM, null))
                .thenReturn(new BigDecimal("200.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculateForIngredient(ri);

        assertThat(result.protein()).isEqualByComparingTo("40.00");
        assertThat(result.fat()).isEqualByComparingTo("10.00");
        assertThat(result.carbohydrates()).isEqualByComparingTo("20.00");
    }

    @Test
    void calculateForIngredientShouldTreatNullBtwAsZero() {
        // Ingredient: all BTW null
        RecipeIngredient ri = buildIngredient(
                null, null, null, null,
                new BigDecimal("100.00"), IngredientUnit.GRAM);

        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("100.00"), IngredientUnit.GRAM, null))
                .thenReturn(new BigDecimal("100.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculateForIngredient(ri);

        assertThat(result.protein()).isEqualByComparingTo("0.00");
        assertThat(result.fat()).isEqualByComparingTo("0.00");
        assertThat(result.carbohydrates()).isEqualByComparingTo("0.00");
    }

    @Test
    void calculateForIngredientShouldUsePiecePortionForGramConversion() {
        // Ingredient: 15g protein, 3g fat, 8g carbs per 100g, portion = 80g/piece
        // Quantity: 2 PIECE  →  grams = 160  →  factor = 1.6
        BigDecimal portion = new BigDecimal("80.00");
        RecipeIngredient ri = buildIngredient(
                new BigDecimal("15.00"), new BigDecimal("3.00"), new BigDecimal("8.00"), portion,
                new BigDecimal("2.00"), IngredientUnit.PIECE);

        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("2.00"), IngredientUnit.PIECE, portion))
                .thenReturn(new BigDecimal("160.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculateForIngredient(ri);

        assertThat(result.protein()).isEqualByComparingTo("24.00");
        assertThat(result.fat()).isEqualByComparingTo("4.80");
        assertThat(result.carbohydrates()).isEqualByComparingTo("12.80");
    }

    @Test
    void calculateForIngredientShouldHandlePartialNullBtw() {
        // Only fat is null, others are set
        RecipeIngredient ri = buildIngredient(
                new BigDecimal("10.00"), null, new BigDecimal("30.00"), null,
                new BigDecimal("50.00"), IngredientUnit.GRAM);

        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("50.00"), IngredientUnit.GRAM, null))
                .thenReturn(new BigDecimal("50.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculateForIngredient(ri);

        assertThat(result.protein()).isEqualByComparingTo("5.00");
        assertThat(result.fat()).isEqualByComparingTo("0.00");
        assertThat(result.carbohydrates()).isEqualByComparingTo("15.00");
    }

    // --- calculateTotal ---

    @Test
    void calculateTotalShouldSumAllIngredients() {
        RecipeIngredient ri1 = buildIngredient(
                new BigDecimal("20.00"), new BigDecimal("4.00"), new BigDecimal("10.00"), null,
                new BigDecimal("100.00"), IngredientUnit.GRAM);
        RecipeIngredient ri2 = buildIngredient(
                new BigDecimal("10.00"), new BigDecimal("6.00"), new BigDecimal("20.00"), null,
                new BigDecimal("200.00"), IngredientUnit.GRAM);

        // ri1: factor = 1.0  →  protein=20, fat=4,  carbs=10
        // ri2: factor = 2.0  →  protein=20, fat=12, carbs=40
        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("100.00"), IngredientUnit.GRAM, null))
                .thenReturn(new BigDecimal("100.00"));
        when(ingredientUnitConversionService.convertToGrams(
                new BigDecimal("200.00"), IngredientUnit.GRAM, null))
                .thenReturn(new BigDecimal("200.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculateTotal(List.of(ri1, ri2));

        assertThat(result.protein()).isEqualByComparingTo("40.00");
        assertThat(result.fat()).isEqualByComparingTo("16.00");
        assertThat(result.carbohydrates()).isEqualByComparingTo("50.00");
    }

    @Test
    void calculateTotalShouldReturnZeroForEmptyIngredientList() {
        NutritionalValuesResponse result = nutritionalValuesService.calculateTotal(List.of());

        assertThat(result.protein()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.fat()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.carbohydrates()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    // --- calculatePerServing ---

    @Test
    void calculatePerServingShouldDivideTotalByServings() {
        NutritionalValuesResponse total = new NutritionalValuesResponse(
                new BigDecimal("40.00"), new BigDecimal("10.00"), new BigDecimal("20.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculatePerServing(total, 4);

        assertThat(result.protein()).isEqualByComparingTo("10.00");
        assertThat(result.fat()).isEqualByComparingTo("2.50");
        assertThat(result.carbohydrates()).isEqualByComparingTo("5.00");
    }

    @Test
    void calculatePerServingShouldReturnTotalWhenServingsIsZero() {
        NutritionalValuesResponse total = new NutritionalValuesResponse(
                new BigDecimal("30.00"), new BigDecimal("5.00"), new BigDecimal("15.00"));

        NutritionalValuesResponse result = nutritionalValuesService.calculatePerServing(total, 0);

        assertThat(result).isEqualTo(total);
    }

    // --- helpers ---

    private RecipeIngredient buildIngredient(BigDecimal protein, BigDecimal fat, BigDecimal carbohydrates,
            BigDecimal portion, BigDecimal quantity, IngredientUnit unit) {
        Ingredient ingredient = new Ingredient();
        ingredient.setProtein(protein);
        ingredient.setFat(fat);
        ingredient.setCarbohydrates(carbohydrates);
        ingredient.setPortion(portion);

        RecipeIngredient ri = new RecipeIngredient();
        ri.setIngredient(ingredient);
        ri.setQuantity(quantity);
        ri.setUnit(unit);
        return ri;
    }
}
