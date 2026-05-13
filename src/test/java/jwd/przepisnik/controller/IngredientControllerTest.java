package jwd.przepisnik.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
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
import jwd.przepisnik.service.IngredientService;
import jwd.przepisnik.web.request.CreateIngredientRequest;
import jwd.przepisnik.web.request.UpdateIngredientRequest;
import jwd.przepisnik.web.response.IngredientItemResponse;
import jwd.przepisnik.web.response.IngredientListResponse;
import jwd.przepisnik.web.response.IngredientResponse;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@ExtendWith(MockitoExtension.class)
class IngredientControllerTest {

    @Mock
    private IngredientService ingredientService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new IngredientController(ingredientService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldReturnSuggestionsForValidQuery() throws Exception {
        when(ingredientService.searchIngredients("ma", 5)).thenReturn(List.of(
                new IngredientSuggestionResponse(UUID.randomUUID(), "Maka"),
                new IngredientSuggestionResponse(UUID.randomUUID(), "Mango")));

        mockMvc.perform(get("/api/ingredients/search")
                .principal(() -> "john")
                .param("query", "ma")
                .param("limit", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data[0].name", equalTo("Maka")))
                .andExpect(jsonPath("$.data[1].name", equalTo("Mango")));
    }

    @Test
    void shouldReturnUnauthorizedWhenPrincipalMissingFromSearch() throws Exception {
        mockMvc.perform(get("/api/ingredients/search")
                .param("query", "ma")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    // New tests for list, create, update, delete

    @Test
    void shouldListIngredientsWithoutAuthentication() throws Exception {
        UUID id = UUID.randomUUID();
        IngredientItemResponse item = new IngredientItemResponse(id, "Mąka",
            BigDecimal.valueOf(10.0), BigDecimal.valueOf(2.0), BigDecimal.valueOf(75.0));
        IngredientListResponse response = new IngredientListResponse(List.of(item), 1, 1L, 0, 20);

        when(ingredientService.listIngredients(0, null)).thenReturn(response);

        mockMvc.perform(get("/api/ingredients/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items[0].name", equalTo("Mąka")))
                .andExpect(jsonPath("$.data.totalElements", equalTo(1)))
                .andExpect(jsonPath("$.data.pageSize", equalTo(20)));
    }

    @Test
    void shouldSearchIngredientsWithPagination() throws Exception {
        UUID id = UUID.randomUUID();
        IngredientItemResponse item = new IngredientItemResponse(id, "Mleko", null, null, null);
        IngredientListResponse response = new IngredientListResponse(List.of(item), 1, 1L, 1, 20);

        when(ingredientService.listIngredients(1, "mleko")).thenReturn(response);

        mockMvc.perform(get("/api/ingredients/list")
                .param("page", "1")
                .param("search", "mleko")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].name", equalTo("Mleko")))
                .andExpect(jsonPath("$.data.currentPage", equalTo(1)));
    }

    @Test
    void shouldDisplayMissingBTWValuesAsNull() throws Exception {
        UUID id = UUID.randomUUID();
        IngredientItemResponse item = new IngredientItemResponse(id, "Sól", null, null, null);
        IngredientListResponse response = new IngredientListResponse(List.of(item), 1, 1L, 0, 20);

        when(ingredientService.listIngredients(0, null)).thenReturn(response);

        mockMvc.perform(get("/api/ingredients/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].protein", is(nullValue())));
    }

    @Test
    void shouldGetIngredientById() throws Exception {
        UUID id = UUID.randomUUID();
        IngredientResponse ingredient = new IngredientResponse(id, "Jajko",
            BigDecimal.valueOf(13.0), BigDecimal.valueOf(11.0), BigDecimal.valueOf(1.1));

        when(ingredientService.getIngredientById(id)).thenReturn(ingredient);

        mockMvc.perform(get("/api/ingredients/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name", equalTo("Jajko")))
                .andExpect(jsonPath("$.data.protein", equalTo(13.0)));
    }

    @Test
    void shouldReturn404WhenIngredientNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(ingredientService.getIngredientById(id))
            .thenThrow(new IllegalArgumentException("Składnik nie znaleziony."));

        mockMvc.perform(get("/api/ingredients/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateIngredientForAuthenticatedUser() throws Exception {
        UUID id = UUID.randomUUID();
        CreateIngredientRequest request = new CreateIngredientRequest(
            "Kurczak", BigDecimal.valueOf(31.0), BigDecimal.valueOf(3.6), BigDecimal.ZERO
        );
        IngredientResponse response = new IngredientResponse(id, "Kurczak",
            BigDecimal.valueOf(31.0), BigDecimal.valueOf(3.6), BigDecimal.ZERO);

        when(ingredientService.createIngredient(any(CreateIngredientRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/ingredients/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name", equalTo("Kurczak")))
                .andExpect(jsonPath("$.data.protein", equalTo(31.0)));
    }

    @Test
    void shouldReturnUnauthorizedWhenCreatingWithoutAuthentication() throws Exception {
        CreateIngredientRequest request = new CreateIngredientRequest("Kurczak", null, null, null);

        mockMvc.perform(post("/api/ingredients/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldReturnBadRequestWhenCreatingDuplicate() throws Exception {
        CreateIngredientRequest request = new CreateIngredientRequest("Cukier", null, null, null);

        when(ingredientService.createIngredient(any(CreateIngredientRequest.class)))
            .thenThrow(new IllegalArgumentException("Składnik 'Cukier' już istnieje."));

        mockMvc.perform(post("/api/ingredients/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldReturnBadRequestWhenCreatingWithTooManyDecimalPlaces() throws Exception {
        CreateIngredientRequest request = new CreateIngredientRequest(
            "Mąka",
            new BigDecimal("10.123"),
            BigDecimal.valueOf(2.0),
            BigDecimal.valueOf(75.0)
        );

        mockMvc.perform(post("/api/ingredients/create")
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldUpdateIngredientForAuthenticatedUser() throws Exception {
        UUID id = UUID.randomUUID();
        UpdateIngredientRequest request = new UpdateIngredientRequest(
            "Kurczak", BigDecimal.valueOf(31.0), BigDecimal.valueOf(3.6), BigDecimal.ZERO
        );
        IngredientResponse response = new IngredientResponse(id, "Kurczak",
            BigDecimal.valueOf(31.0), BigDecimal.valueOf(3.6), BigDecimal.ZERO);

        when(ingredientService.updateIngredient(eq(id), any(UpdateIngredientRequest.class)))
            .thenReturn(response);

        mockMvc.perform(put("/api/ingredients/update/" + id)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name", equalTo("Kurczak")));
    }

    @Test
    void shouldReturnUnauthorizedWhenUpdatingWithoutAuthentication() throws Exception {
        UUID id = UUID.randomUUID();
        UpdateIngredientRequest request = new UpdateIngredientRequest("Kurczak", null, null, null);

        mockMvc.perform(put("/api/ingredients/update/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnBadRequestWhenUpdatingDuplicate() throws Exception {
        UUID id = UUID.randomUUID();
        UpdateIngredientRequest request = new UpdateIngredientRequest("Cukier", null, null, null);

        when(ingredientService.updateIngredient(eq(id), any(UpdateIngredientRequest.class)))
            .thenThrow(new IllegalArgumentException("Składnik 'Cukier' już istnieje."));

        mockMvc.perform(put("/api/ingredients/update/" + id)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void shouldDeleteIngredientForAuthenticatedUser() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/ingredients/delete/" + id)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        verify(ingredientService).deleteIngredient(id);
    }

    @Test
    void shouldReturnUnauthorizedWhenDeletingWithoutAuthentication() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/ingredients/delete/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonexistentIngredient() throws Exception {
        UUID id = UUID.randomUUID();

        doThrow(new IllegalArgumentException("Składnik nie znaleziony."))
            .when(ingredientService).deleteIngredient(id);

        mockMvc.perform(delete("/api/ingredients/delete/" + id)
                .principal(() -> "john")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
