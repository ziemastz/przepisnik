package jwd.przepisnik.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@ExtendWith(MockitoExtension.class)
class IngredientServiceTest {

    @Mock
    private IngredientRepository ingredientRepository;

    @InjectMocks
    private IngredientService ingredientService;

    @Test
    void shouldSearchIngredientsUsingNormalizedQueryAndDefaultLimit() {
        Ingredient ingredient = new Ingredient();
        ingredient.setId(UUID.randomUUID());
        ingredient.setName("Maka");
        ingredient.setNormalizedName("maka");

        when(ingredientRepository.findByNormalizedNameStartingWithOrderByNormalizedNameAsc(
                eq("ma"), eq(PageRequest.of(0, 10))))
                .thenReturn(List.of(ingredient));

        List<IngredientSuggestionResponse> result = ingredientService.searchIngredients("  MA  ", null);

        assertThat(result).containsExactly(new IngredientSuggestionResponse(ingredient.getId(), "Maka"));
        verify(ingredientRepository).findByNormalizedNameStartingWithOrderByNormalizedNameAsc(
                "ma", PageRequest.of(0, 10));
    }

    @Test
    void shouldCapLimitAtMaximumValue() {
        when(ingredientRepository.findByNormalizedNameStartingWithOrderByNormalizedNameAsc(
                eq("ma"), eq(PageRequest.of(0, 20))))
                .thenReturn(List.of());

        ingredientService.searchIngredients("ma", 100);

        verify(ingredientRepository).findByNormalizedNameStartingWithOrderByNormalizedNameAsc(
                "ma", PageRequest.of(0, 20));
    }

    @Test
    void shouldRejectBlankQuery() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientService.searchIngredients("   ", 5));

        assertThat(exception.getMessage()).isEqualTo(AppMessages.Service.INGREDIENT_QUERY_EMPTY);
    }

    @Test
    void shouldRejectLimitBelowOne() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientService.searchIngredients("ma", 0));

        assertThat(exception.getMessage()).isEqualTo(AppMessages.Service.INGREDIENT_LIMIT_POSITIVE);
    }
}
