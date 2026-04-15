package jwd.przepisnik.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import jwd.przepisnik.exception.GlobalExceptionHandler;
import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.models.RecipeIngredient;
import jwd.przepisnik.models.User;
import jwd.przepisnik.service.RecipeService;
import jwd.przepisnik.web.mapper.RecipeMapper;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.CreateRecipeRequest;
import jwd.przepisnik.web.request.IngredientAmountRequest;
import jwd.przepisnik.web.request.UpdateRecipeRequest;

@ExtendWith(MockitoExtension.class)
class RecipeControllerTest {

    @Mock
    private RecipeService recipeService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new RecipeController(recipeService, new RecipeMapper()))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldCreateRecipe() throws Exception {
        IngredientAmountRequest ingredientRequest = new IngredientAmountRequest(
                "Maka", new BigDecimal("250.00"), IngredientUnit.GRAM);
        CreateRecipeRequest createRequest = new CreateRecipeRequest(
                "Nalesniki", "Wymieszaj skladniki i usmaz.", 20, 4, null, List.of(ingredientRequest));

        Recipe recipe = buildRecipe("john");
        when(recipeService.createRecipe(any(CreateRecipeRequest.class), eq("john"))).thenReturn(recipe);

        BaseRequest<CreateRecipeRequest> requestBody = new BaseRequest<>(createRequest);

        mockMvc.perform(post("/api/recipes/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", equalTo("Nalesniki")))
                .andExpect(jsonPath("$.data.description", equalTo("Wymieszaj skladniki i usmaz.")))
                .andExpect(jsonPath("$.data.isPrivate", is(false)));
    }

    @Test
    void shouldCreateRecipeWhenQuantityUsesCommaDecimalSeparator() throws Exception {
        Recipe recipe = buildRecipe("john");
        when(recipeService.createRecipe(any(CreateRecipeRequest.class), eq("john"))).thenReturn(recipe);

        String requestBody = """
                {
                  "data": {
                    "name": "Nalesniki",
                    "description": "Wymieszaj skladniki i usmaz.",
                    "preparationTimeMinutes": 20,
                    "servings": 4,
                    "ingredients": [
                      {
                        "name": "Maka",
                        "quantity": "0,5",
                        "unit": "GRAM"
                      }
                    ]
                  }
                }
                """;

        mockMvc.perform(post("/api/recipes/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    void shouldGetRecipeById() throws Exception {
        UUID recipeId = UUID.randomUUID();
        when(recipeService.getRecipeForUser(recipeId, "john")).thenReturn(Optional.of(buildRecipe("john")));

        mockMvc.perform(get("/api/recipes/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.author", equalTo("john")));
    }

    @Test
    void shouldReturnUnauthorizedWhenPrincipalMissing() throws Exception {
        mockMvc.perform(get("/api/recipes/my")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldReturnUnauthorizedWhenCreatingRecipeWithoutPrincipal() throws Exception {
        mockMvc.perform(post("/api/recipes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                                                                                                {
                                                                                                        "data": {
                                                                                                                "name": "Test",
                                                                                                                "description": "Opis testowy",
                                                                                                                "preparationTimeMinutes": 20,
                                                                                                                "servings": 4,
                                                                                                                "ingredients": [
                                                                                                                        {
                                                                                                                                "name": "Maka",
                                                                                                                                "quantity": 100,
                                                                                                                                "unit": "GRAM"
                                                                                                                        }
                                                                                                                ]
                                                                                                        }
                                                                                                }
                        """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldGetMyRecipes() throws Exception {
        Recipe recipe = buildRecipe("john");
        when(recipeService.getRecipesForUser("john")).thenReturn(List.of(recipe));

        mockMvc.perform(get("/api/recipes/my")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.length()", equalTo(1)))
                .andExpect(jsonPath("$.data[0].name", equalTo("Nalesniki")));
    }

    @Test
    void shouldReturnNotFoundWhenRecipeDoesNotExist() throws Exception {
        UUID recipeId = UUID.randomUUID();
        when(recipeService.getRecipeForUser(recipeId, "john")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/recipes/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldUpdateRecipe() throws Exception {
        UUID recipeId = UUID.randomUUID();
        IngredientAmountRequest ingredientRequest = new IngredientAmountRequest(
                "Maka", new BigDecimal("300.00"), IngredientUnit.GRAM);
        UpdateRecipeRequest updateRequest = new UpdateRecipeRequest(
                "Nalesniki updated", "Nowy sposob przygotowania.", 25, 5, true, List.of(ingredientRequest));

        Recipe updatedRecipe = buildRecipe("john");
        updatedRecipe.setName("Nalesniki updated");
        updatedRecipe.setDescription("Nowy sposob przygotowania.");
        updatedRecipe.setPrivateRecipe(true);
        when(recipeService.updateRecipe(eq(recipeId), any(UpdateRecipeRequest.class), eq("john")))
                .thenReturn(Optional.of(updatedRecipe));

        BaseRequest<UpdateRecipeRequest> requestBody = new BaseRequest<>(updateRequest);

        mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", equalTo("Nalesniki updated")))
                .andExpect(jsonPath("$.data.description", equalTo("Nowy sposob przygotowania.")))
                .andExpect(jsonPath("$.data.isPrivate", is(true)));
    }

        @Test
        void shouldReturnBadRequestWhenCreatingRecipeWithMissingData() throws Exception {
                mockMvc.perform(post("/api/recipes/create")
                                .principal(() -> "john")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}"))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success", is(false)));
        }

                @Test
                void shouldUpdateRecipeWhenQuantityUsesCommaDecimalSeparator() throws Exception {
                                UUID recipeId = UUID.randomUUID();
                                Recipe updatedRecipe = buildRecipe("john");
                                updatedRecipe.setName("Nalesniki updated");
                                updatedRecipe.setDescription("Nowy sposob przygotowania.");
                                when(recipeService.updateRecipe(eq(recipeId), any(UpdateRecipeRequest.class), eq("john")))
                                                                .thenReturn(Optional.of(updatedRecipe));

                                String requestBody = """
                                                                {
                                                                        "data": {
                                                                                "name": "Nalesniki updated",
                                                                                "description": "Nowy sposob przygotowania.",
                                                                                "preparationTimeMinutes": 25,
                                                                                "servings": 5,
                                                                                "ingredients": [
                                                                                        {
                                                                                                "name": "Maka",
                                                                                                "quantity": "0,5",
                                                                                                "unit": "GRAM"
                                                                                        }
                                                                                ]
                                                                        }
                                                                }
                                                                """;

                                mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                                                                .principal(() -> "john")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(requestBody))
                                                                .andExpect(status().isOk())
                                                                .andExpect(jsonPath("$.success", is(true)));
                }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonExistentRecipe() throws Exception {
        UUID recipeId = UUID.randomUUID();
        IngredientAmountRequest ingredientRequest = new IngredientAmountRequest(
                "Maka", new BigDecimal("100.00"), IngredientUnit.GRAM);
        UpdateRecipeRequest updateRequest = new UpdateRecipeRequest(
                "Test", "Opis testowy", 20, 4, null, List.of(ingredientRequest));

        when(recipeService.updateRecipe(eq(recipeId), any(UpdateRecipeRequest.class), eq("john")))
                .thenReturn(Optional.empty());

        BaseRequest<UpdateRecipeRequest> requestBody = new BaseRequest<>(updateRequest);

        mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

        @Test
        void shouldReturnUnauthorizedWhenUpdatingRecipeWithoutPrincipal() throws Exception {
                UUID recipeId = UUID.randomUUID();

                mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                                .contentType(MediaType.APPLICATION_JSON)
                                                                                                                                .content("""
                                                                                                                                                                                                {
                                                                                                                                                                                                        "data": {
                                                                                                                                                                                                                "name": "Test",
                                                                                                                                                                                                                "description": "Opis testowy",
                                                                                                                                                                                                                "preparationTimeMinutes": 20,
                                                                                                                                                                                                                "servings": 4,
                                                                                                                                                                                                                "ingredients": [
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                "name": "Maka",
                                                                                                                                                                                                                                "quantity": 100,
                                                                                                                                                                                                                                "unit": "GRAM"
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                ]
                                                                                                                                                                                                        }
                                                                                                                                                                                                }
                                                                                                                                                                                                """))
                                .andExpect(status().isUnauthorized())
                                .andExpect(jsonPath("$.success", is(false)));
        }

        @Test
        void shouldReturnBadRequestWhenUpdatingRecipeWithMissingData() throws Exception {
                UUID recipeId = UUID.randomUUID();

                mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                                .principal(() -> "john")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}"))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success", is(false)));
        }

    @Test
    void shouldDeleteRecipe() throws Exception {
        UUID recipeId = UUID.randomUUID();
        when(recipeService.deleteRecipe(recipeId, "john")).thenReturn(true);

        mockMvc.perform(post("/api/recipes/delete/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonExistentRecipe() throws Exception {
        UUID recipeId = UUID.randomUUID();
        when(recipeService.deleteRecipe(recipeId, "john")).thenReturn(false);

        mockMvc.perform(post("/api/recipes/delete/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

        @Test
        void shouldReturnUnauthorizedWhenDeletingRecipeWithoutPrincipal() throws Exception {
                UUID recipeId = UUID.randomUUID();

                mockMvc.perform(post("/api/recipes/delete/{id}", recipeId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isUnauthorized())
                                .andExpect(jsonPath("$.success", is(false)));
        }

    private Recipe buildRecipe(String username) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(username);

        Ingredient ingredient = new Ingredient();
        ingredient.setId(UUID.randomUUID());
        ingredient.setName("Maka");
        ingredient.setNormalizedName("maka");

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setId(UUID.randomUUID());
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(new BigDecimal("250.00"));
        recipeIngredient.setUnit(IngredientUnit.GRAM);

        Recipe recipe = new Recipe();
        recipe.setId(UUID.randomUUID());
        recipe.setName("Nalesniki");
        recipe.setDescription("Wymieszaj skladniki i usmaz.");
        recipe.setPreparationTimeMinutes(20);
        recipe.setServings(4);
        recipe.setPrivateRecipe(false);
        recipe.setAuthor(user);
        recipe.setIngredients(List.of(recipeIngredient));
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());

        return recipe;
    }
}
