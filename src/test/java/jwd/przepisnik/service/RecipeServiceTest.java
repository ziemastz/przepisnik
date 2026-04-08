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
    void createRecipeShouldReuseExistingIngredientByNormalizedName() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);
        user.setUsername("john");

        Ingredient existingIngredient = new Ingredient();
        existingIngredient.setId(UUID.randomUUID());
        existingIngredient.setName("Maka");
        existingIngredient.setNormalizedName("maka");

        CreateRecipeRequest request = new CreateRecipeRequest();
        request.setName("Nalesniki");
        request.setPreparationTimeMinutes(20);
        request.setServings(4);

        IngredientAmountRequest ingredientAmountRequest = new IngredientAmountRequest();
        ingredientAmountRequest.setName("Maka");
        ingredientAmountRequest.setQuantity(new BigDecimal("250.00"));
        ingredientAmountRequest.setUnit(IngredientUnit.GRAM);
        request.setIngredients(List.of(ingredientAmountRequest));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(ingredientRepository.findByNormalizedName("maka")).thenReturn(Optional.of(existingIngredient));
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Recipe created = recipeService.createRecipe(request, "john");

        assertEquals("Nalesniki", created.getName());
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

        UpdateRecipeRequest request = new UpdateRecipeRequest();
        request.setName("Nowa nazwa");
        request.setPreparationTimeMinutes(10);
        request.setServings(2);

        IngredientAmountRequest ingredientAmountRequest = new IngredientAmountRequest();
        ingredientAmountRequest.setName("Sol");
        ingredientAmountRequest.setQuantity(new BigDecimal("1.00"));
        ingredientAmountRequest.setUnit(IngredientUnit.TEASPOON);
        request.setIngredients(List.of(ingredientAmountRequest));

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

        CreateRecipeRequest request = new CreateRecipeRequest();
        request.setName("Nalesniki");
        request.setPreparationTimeMinutes(20);
        request.setServings(4);

        IngredientAmountRequest flour1 = new IngredientAmountRequest();
        flour1.setName("Maka");
        flour1.setQuantity(new BigDecimal("200.00"));
        flour1.setUnit(IngredientUnit.GRAM);

        IngredientAmountRequest flour2 = new IngredientAmountRequest();
        flour2.setName("maka");
        flour2.setQuantity(new BigDecimal("50.00"));
        flour2.setUnit(IngredientUnit.GRAM);

        request.setIngredients(List.of(flour1, flour2));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> recipeService.createRecipe(request, "john"));

        assertEquals("Ingredient names must be unique within a recipe.", exception.getMessage());
        verify(recipeRepository, never()).save(any(Recipe.class));
    }
}
