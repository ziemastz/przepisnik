package jwd.przepisnik.web.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.service.NutritionalValuesService;
import jwd.przepisnik.web.response.IngredientAmountResponse;
import jwd.przepisnik.web.response.NutritionalValuesResponse;
import jwd.przepisnik.web.response.RecipeResponse;

@Component
public class RecipeMapper {

    private final NutritionalValuesService nutritionalValuesService;

    public RecipeMapper(NutritionalValuesService nutritionalValuesService) {
        this.nutritionalValuesService = nutritionalValuesService;
    }

    public RecipeResponse toResponse(Recipe recipe) {
        List<IngredientAmountResponse> ingredientResponses = recipe.getIngredients().stream()
                .map(this::toIngredientResponse)
                .toList();

        NutritionalValuesResponse total = nutritionalValuesService.calculateTotal(recipe.getIngredients());
        NutritionalValuesResponse perServing = nutritionalValuesService.calculatePerServing(total,
                recipe.getServings());

        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getPreparationTimeMinutes(),
                recipe.getServings(),
                recipe.isPrivateRecipe(),
                recipe.getAuthor().getUsername(),
                recipe.getCreatedAt(),
                recipe.getUpdatedAt(),
                ingredientResponses,
                total,
                perServing);
    }

    public List<RecipeResponse> toResponses(List<Recipe> recipes) {
        return recipes.stream().map(this::toResponse).toList();
    }

    private IngredientAmountResponse toIngredientResponse(RecipeIngredient recipeIngredient) {
        NutritionalValuesResponse nutritionalValues = nutritionalValuesService
                .calculateForIngredient(recipeIngredient);
        return new IngredientAmountResponse(
                recipeIngredient.getIngredient().getName(),
                recipeIngredient.getQuantity(),
                recipeIngredient.getUnit(),
                nutritionalValues);
    }
}
