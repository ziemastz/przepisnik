package jwd.przepisnik.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import jwd.przepisnik.exception.GlobalExceptionHandler;
import jwd.przepisnik.service.IngredientService;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@ExtendWith(MockitoExtension.class)
class IngredientControllerTest {

    @Mock
    private IngredientService ingredientService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new IngredientController(ingredientService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
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
    void shouldReturnUnauthorizedWhenPrincipalMissing() throws Exception {
        mockMvc.perform(get("/api/ingredients/search")
                .param("query", "ma")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
