package jwd.przepisnik.web.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.web.response.IngredientAmountResponse;
import jwd.przepisnik.web.response.RecipeResponse;

@Component
public class RecipeMapper {
    public RecipeResponse toResponse(Recipe recipe) {
        List<IngredientAmountResponse> ingredientResponses = recipe.getIngredients().stream()
                .map(this::toIngredientResponse)
                .toList();

        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getPreparationTimeMinutes(),
                recipe.getServings(),
                recipe.getAuthor().getUsername(),
                recipe.getCreatedAt(),
                recipe.getUpdatedAt(),
                ingredientResponses);
    }

    public List<RecipeResponse> toResponses(List<Recipe> recipes) {
        return recipes.stream().map(this::toResponse).toList();
    }

    private IngredientAmountResponse toIngredientResponse(RecipeIngredient recipeIngredient) {
        return new IngredientAmountResponse(
                recipeIngredient.getIngredient().getName(),
                recipeIngredient.getQuantity(),
                recipeIngredient.getUnit());
    }
}
