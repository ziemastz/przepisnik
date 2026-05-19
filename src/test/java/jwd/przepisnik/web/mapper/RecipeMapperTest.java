package jwd.przepisnik.web.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.models.User;
import jwd.przepisnik.service.NutritionalValuesService;
import jwd.przepisnik.web.response.NutritionalValuesResponse;
import jwd.przepisnik.web.response.RecipeResponse;

@ExtendWith(MockitoExtension.class)
class RecipeMapperTest {

    @Mock
    private NutritionalValuesService nutritionalValuesService;

    @InjectMocks
    private RecipeMapper recipeMapper;

    @Test
    void toResponseShouldReuseIngredientNutritionToBuildTotals() {
        RecipeIngredient firstIngredient = buildRecipeIngredient("Flour", new BigDecimal("100.00"));
        RecipeIngredient secondIngredient = buildRecipeIngredient("Milk", new BigDecimal("200.00"));

        NutritionalValuesResponse firstValues = new NutritionalValuesResponse(
                new BigDecimal("10.00"), new BigDecimal("1.50"), new BigDecimal("70.00"));
        NutritionalValuesResponse secondValues = new NutritionalValuesResponse(
                new BigDecimal("6.00"), new BigDecimal("5.00"), new BigDecimal("10.00"));
        NutritionalValuesResponse totalValues = new NutritionalValuesResponse(
                new BigDecimal("16.00"), new BigDecimal("6.50"), new BigDecimal("80.00"));
        NutritionalValuesResponse perServingValues = new NutritionalValuesResponse(
                new BigDecimal("8.00"), new BigDecimal("3.25"), new BigDecimal("40.00"));

        when(nutritionalValuesService.calculateForIngredient(firstIngredient)).thenReturn(firstValues);
        when(nutritionalValuesService.calculateForIngredient(secondIngredient)).thenReturn(secondValues);
        when(nutritionalValuesService.calculateTotalFromValues(List.of(firstValues, secondValues))).thenReturn(
                totalValues);
        when(nutritionalValuesService.calculatePerServing(totalValues, 2)).thenReturn(perServingValues);

        RecipeResponse response = recipeMapper.toResponse(buildRecipe(List.of(firstIngredient, secondIngredient)));

        assertThat(response.nutritionalValues()).isEqualTo(totalValues);
        assertThat(response.nutritionalValuesPerServing()).isEqualTo(perServingValues);
        verify(nutritionalValuesService).calculateForIngredient(firstIngredient);
        verify(nutritionalValuesService).calculateForIngredient(secondIngredient);
        verify(nutritionalValuesService).calculateTotalFromValues(eq(List.of(firstValues, secondValues)));
        verify(nutritionalValuesService).calculatePerServing(totalValues, 2);
        verify(nutritionalValuesService, never()).calculateTotal(anyList());
    }

    private Recipe buildRecipe(List<RecipeIngredient> ingredients) {
        User author = new User();
        author.setUsername("john");

        Recipe recipe = new Recipe();
        recipe.setId(UUID.randomUUID());
        recipe.setName("Pancakes");
        recipe.setDescription("Mix and fry");
        recipe.setPreparationTimeMinutes(15);
        recipe.setServings(2);
        recipe.setPrivateRecipe(false);
        recipe.setAuthor(author);
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        recipe.setIngredients(ingredients);
        return recipe;
    }

    private RecipeIngredient buildRecipeIngredient(String name, BigDecimal quantity) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(quantity);
        recipeIngredient.setUnit(IngredientUnit.GRAM);
        return recipeIngredient;
    }
}
