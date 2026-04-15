package jwd.przepisnik.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.User;
import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.repository.RecipeRepository;
import jwd.przepisnik.repository.UserRepository;
import jwd.przepisnik.web.request.CreateRecipeRequest;
import jwd.przepisnik.web.request.IngredientAmountRequest;
import jwd.przepisnik.web.request.UpdateRecipeRequest;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;
    @Mock
    private IngredientRepository ingredientRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RecipeService recipeService;

    @Test
    void getPublicRecipesShouldPassNullQueryWhenBlank() {
        when(recipeRepository.findPublicRecipes(null)).thenReturn(List.of());

        List<Recipe> result = recipeService.getPublicRecipes("   ");

        assertEquals(0, result.size());
        verify(recipeRepository).findPublicRecipes(null);
    }

    @Test
    void getPublicRecipesShouldPassNullQueryWhenNull() {
        when(recipeRepository.findPublicRecipes(null)).thenReturn(List.of());

        List<Recipe> result = recipeService.getPublicRecipes(null);

        assertEquals(0, result.size());
        verify(recipeRepository).findPublicRecipes(null);
    }

    @Test
    void getPublicRecipesShouldPassTrimmedQueryToRepository() {
        Recipe recipe = new Recipe();
        recipe.setName("Nalesniki");
        when(recipeRepository.findPublicRecipes("nale")).thenReturn(List.of(recipe));

        List<Recipe> result = recipeService.getPublicRecipes("  nale  ");

        assertEquals(1, result.size());
        assertEquals("Nalesniki", result.get(0).getName());
        verify(recipeRepository).findPublicRecipes("nale");
    }

    @Test
    void createRecipeShouldReuseExistingIngredientByNormalizedName() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);
        user.setUsername("john");

        Ingredient existingIngredient = new Ingredient();
        existingIngredient.setId(UUID.randomUUID());
        existingIngredient.setName("Maka");
        existingIngredient.setNormalizedName("maka");

        IngredientAmountRequest ingredientAmountRequest = new IngredientAmountRequest(
                "Maka", new BigDecimal("250.00"), IngredientUnit.GRAM);
        CreateRecipeRequest request = new CreateRecipeRequest(
                "Nalesniki", "Wymieszaj skladniki i usmaz.", 20, 4, null, List.of(ingredientAmountRequest));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(ingredientRepository.findByNormalizedName("maka")).thenReturn(Optional.of(existingIngredient));
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Recipe created = recipeService.createRecipe(request, "john");

        assertEquals("Nalesniki", created.getName());
        assertEquals("Wymieszaj skladniki i usmaz.", created.getDescription());
        assertEquals(false, created.isPrivateRecipe());
        assertEquals(1, created.getIngredients().size());
        assertEquals(existingIngredient.getId(), created.getIngredients().get(0).getIngredient().getId());
        verify(ingredientRepository).findByNormalizedName("maka");
    }

    @Test
    void updateRecipeShouldReturnEmptyWhenRecipeNotOwnedByUser() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        UUID recipeId = UUID.randomUUID();
        user.setId(userId);
        user.setUsername("john");

        IngredientAmountRequest ingredientAmountRequest = new IngredientAmountRequest(
                "Sol", new BigDecimal("1.00"), IngredientUnit.TEASPOON);
        UpdateRecipeRequest request = new UpdateRecipeRequest(
                "Nowa nazwa", "Dopraw i podawaj.", 10, 2, null, List.of(ingredientAmountRequest));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(recipeRepository.findByIdAndAuthorId(recipeId, userId)).thenReturn(Optional.empty());

        Optional<Recipe> result = recipeService.updateRecipe(recipeId, request, "john");

        assertTrue(result.isEmpty());
    }

    @Test
    void createRecipeShouldRejectDuplicateIngredientsInSingleRecipe() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("john");

        IngredientAmountRequest flour1 = new IngredientAmountRequest(
                "Maka", new BigDecimal("200.00"), IngredientUnit.GRAM);
        IngredientAmountRequest flour2 = new IngredientAmountRequest(
                "maka", new BigDecimal("50.00"), IngredientUnit.GRAM);
        CreateRecipeRequest request = new CreateRecipeRequest(
                "Nalesniki", "Opis przygotowania", 20, 4, null, List.of(flour1, flour2));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> recipeService.createRecipe(request, "john"));

        assertEquals("Ingredient names must be unique within a recipe.", exception.getMessage());
        verify(recipeRepository, never()).save(any(Recipe.class));
    }

    @Test
    void updateRecipeShouldUpdateDescription() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        UUID recipeId = UUID.randomUUID();
        user.setId(userId);
        user.setUsername("john");

        Recipe existingRecipe = new Recipe();
        existingRecipe.setId(recipeId);
        existingRecipe.setName("Stary przepis");
        existingRecipe.setDescription("Stary opis");
        existingRecipe.setAuthor(user);

        Ingredient ingredient = new Ingredient();
        ingredient.setId(UUID.randomUUID());
        ingredient.setName("Sol");
        ingredient.setNormalizedName("sol");

        IngredientAmountRequest ingredientAmountRequest = new IngredientAmountRequest(
                "Sol", new BigDecimal("1.00"), IngredientUnit.TEASPOON);
        UpdateRecipeRequest request = new UpdateRecipeRequest(
                "Nowy przepis", "Nowy opis przygotowania", 10, 2, true, List.of(ingredientAmountRequest));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(recipeRepository.findByIdAndAuthorId(recipeId, userId)).thenReturn(Optional.of(existingRecipe));
        when(ingredientRepository.findByNormalizedName("sol")).thenReturn(Optional.of(ingredient));
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Recipe> result = recipeService.updateRecipe(recipeId, request, "john");

        assertTrue(result.isPresent());
        assertEquals("Nowy opis przygotowania", result.get().getDescription());
                assertTrue(result.get().isPrivateRecipe());
    }
}
