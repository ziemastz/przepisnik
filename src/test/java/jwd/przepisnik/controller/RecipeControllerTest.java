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
        CreateRecipeRequest createRequest = new CreateRecipeRequest();
        createRequest.setName("Nalesniki");
        createRequest.setPreparationTimeMinutes(20);
        createRequest.setServings(4);

        IngredientAmountRequest ingredientRequest = new IngredientAmountRequest();
        ingredientRequest.setName("Maka");
        ingredientRequest.setQuantity(new BigDecimal("250.00"));
        ingredientRequest.setUnit(IngredientUnit.GRAM);
        createRequest.setIngredients(List.of(ingredientRequest));

        Recipe recipe = buildRecipe("john");
        when(recipeService.createRecipe(any(CreateRecipeRequest.class), eq("john"))).thenReturn(recipe);

        BaseRequest<CreateRecipeRequest> requestBody = new BaseRequest<>(createRequest);

        mockMvc.perform(post("/api/recipes/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", equalTo("Nalesniki")));
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
        UpdateRecipeRequest updateRequest = new UpdateRecipeRequest();
        updateRequest.setName("Nalesniki updated");
        updateRequest.setPreparationTimeMinutes(25);
        updateRequest.setServings(5);

        IngredientAmountRequest ingredientRequest = new IngredientAmountRequest();
        ingredientRequest.setName("Maka");
        ingredientRequest.setQuantity(new BigDecimal("300.00"));
        ingredientRequest.setUnit(IngredientUnit.GRAM);
        updateRequest.setIngredients(List.of(ingredientRequest));

        Recipe updatedRecipe = buildRecipe("john");
        updatedRecipe.setName("Nalesniki updated");
        when(recipeService.updateRecipe(eq(recipeId), any(UpdateRecipeRequest.class), eq("john")))
                .thenReturn(Optional.of(updatedRecipe));

        BaseRequest<UpdateRecipeRequest> requestBody = new BaseRequest<>(updateRequest);

        mockMvc.perform(post("/api/recipes/update/{id}", recipeId)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", equalTo("Nalesniki updated")));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonExistentRecipe() throws Exception {
        UUID recipeId = UUID.randomUUID();
        UpdateRecipeRequest updateRequest = new UpdateRecipeRequest();
        updateRequest.setName("Test");
        updateRequest.setPreparationTimeMinutes(20);
        updateRequest.setServings(4);
        updateRequest.setIngredients(List.of());

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
        recipe.setPreparationTimeMinutes(20);
        recipe.setServings(4);
        recipe.setAuthor(user);
        recipe.setIngredients(List.of(recipeIngredient));
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());

        return recipe;
    }
}
