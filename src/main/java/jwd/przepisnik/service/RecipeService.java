package jwd.przepisnik.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.models.User;
import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.repository.RecipeRepository;
import jwd.przepisnik.repository.UserRepository;
import jwd.przepisnik.web.request.CreateRecipeRequest;
import jwd.przepisnik.web.request.IngredientAmountRequest;
import jwd.przepisnik.web.request.UpdateRecipeRequest;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    public RecipeService(
            RecipeRepository recipeRepository,
            IngredientRepository ingredientRepository,
            UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Recipe createRecipe(CreateRecipeRequest request, String username) {
        Objects.requireNonNull(request, "Recipe request cannot be null.");

        User author = requireUser(username);

        Recipe recipe = new Recipe();
        recipe.setName(request.name().trim());
        recipe.setDescription(request.description().trim());
        recipe.setPreparationTimeMinutes(request.preparationTimeMinutes());
        recipe.setServings(request.servings());
        recipe.setAuthor(author);
        recipe.replaceIngredients(buildRecipeIngredients(request.ingredients()));

        return recipeRepository.save(recipe);
    }

    @Transactional(readOnly = true)
    public Optional<Recipe> getRecipeForUser(UUID recipeId, String username) {
        User author = requireUser(username);
        return recipeRepository.findByIdAndAuthorId(recipeId, author.getId());
    }

    @Transactional(readOnly = true)
    public List<Recipe> getRecipesForUser(String username) {
        User author = requireUser(username);
        return recipeRepository.findAllByAuthorIdOrderByCreatedAtDesc(author.getId());
    }

    @Transactional
    public Optional<Recipe> updateRecipe(UUID recipeId, UpdateRecipeRequest request, String username) {
        Objects.requireNonNull(request, "Recipe request cannot be null.");

        User author = requireUser(username);

        return recipeRepository.findByIdAndAuthorId(recipeId, author.getId())
                .map(existingRecipe -> {
                    existingRecipe.setName(request.name().trim());
                    existingRecipe.setDescription(request.description().trim());
                    existingRecipe.setPreparationTimeMinutes(request.preparationTimeMinutes());
                    existingRecipe.setServings(request.servings());
                    // Clear old ingredients and flush so Hibernate emits the DELETEs
                    // before the INSERTs for the new set — prevents unique constraint violations.
                    existingRecipe.getIngredients().clear();
                    recipeRepository.flush();
                    existingRecipe.replaceIngredients(buildRecipeIngredients(request.ingredients()));
                    return recipeRepository.save(existingRecipe);
                });
    }

    @Transactional
    public boolean deleteRecipe(UUID recipeId, String username) {
        User author = requireUser(username);

        return recipeRepository.findByIdAndAuthorId(recipeId, author.getId())
                .map(recipe -> {
                    recipeRepository.delete(recipe);
                    return true;
                })
                .orElse(false);
    }

    private User requireUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user was not found."));
    }

    private List<RecipeIngredient> buildRecipeIngredients(List<IngredientAmountRequest> ingredientRequests) {
        Set<String> seenIngredients = new HashSet<>();
        List<RecipeIngredient> recipeIngredients = new ArrayList<>();

        for (IngredientAmountRequest ingredientRequest : ingredientRequests) {
            String displayName = ingredientRequest.name().trim();
            String normalizedName = normalizeIngredientName(displayName);

            if (!seenIngredients.add(normalizedName)) {
                throw new IllegalArgumentException("Ingredient names must be unique within a recipe.");
            }

            Ingredient ingredient = ingredientRepository.findByNormalizedName(normalizedName)
                    .orElseGet(() -> createIngredient(displayName, normalizedName));

            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(ingredientRequest.quantity());
            recipeIngredient.setUnit(ingredientRequest.unit());
            recipeIngredients.add(recipeIngredient);
        }

        return recipeIngredients;
    }

    private Ingredient createIngredient(String name, String normalizedName) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        ingredient.setNormalizedName(normalizedName);
        return ingredientRepository.save(ingredient);
    }

    private String normalizeIngredientName(String ingredientName) {
        return ingredientName.trim().toLowerCase(Locale.ROOT);
    }
}
