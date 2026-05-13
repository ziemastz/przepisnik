package jwd.przepisnik.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.web.request.CreateIngredientRequest;
import jwd.przepisnik.web.request.UpdateIngredientRequest;
import jwd.przepisnik.web.response.IngredientItemResponse;
import jwd.przepisnik.web.response.IngredientListResponse;
import jwd.przepisnik.web.response.IngredientResponse;
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

    // New tests for list, create, update, delete functionality

    @Test
    void shouldListAllIngredientsOnFirstPage() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = createTestIngredient(id, "Oliwa", "oliwa", 
            BigDecimal.ZERO, BigDecimal.valueOf(100), BigDecimal.ZERO);

        Page<Ingredient> page = new PageImpl<>(List.of(ingredient), PageRequest.of(0, 20), 1);
        when(ingredientRepository.findAllByOrderByNameAsc(eq(PageRequest.of(0, 20))))
                .thenReturn(page);

        IngredientListResponse result = ingredientService.listIngredients(0, null);

        assertThat(result.items()).hasSize(1);
        assertThat(result.totalElements()).isEqualTo(1);
        assertThat(result.totalPages()).isEqualTo(1);
        assertThat(result.currentPage()).isEqualTo(0);
        assertThat(result.items().get(0).name()).isEqualTo("Oliwa");
    }

    @Test
    void shouldSearchIngredientsWithPagination() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = createTestIngredient(id, "Mleko", "mleko",
            BigDecimal.valueOf(3.2), BigDecimal.valueOf(3.6), BigDecimal.valueOf(4.8));

        Page<Ingredient> page = new PageImpl<>(List.of(ingredient), PageRequest.of(0, 20), 1);
        when(ingredientRepository.findByNormalizedNameContainingOrderByNameAsc(
                eq("mleko"), eq(PageRequest.of(0, 20))))
                .thenReturn(page);

        IngredientListResponse result = ingredientService.listIngredients(0, "mleko");

        assertThat(result.items()).hasSize(1);
        IngredientItemResponse item = result.items().get(0);
        assertThat(item.protein()).isEqualTo(BigDecimal.valueOf(3.2));
        assertThat(item.fat()).isEqualTo(BigDecimal.valueOf(3.6));
        assertThat(item.carbohydrates()).isEqualTo(BigDecimal.valueOf(4.8));
    }

    @Test
    void shouldDisplayNullBTWValuesAsNull() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = createTestIngredient(id, "Sól", "sol", null, null, null);

        Page<Ingredient> page = new PageImpl<>(List.of(ingredient), PageRequest.of(0, 20), 1);
        when(ingredientRepository.findAllByOrderByNameAsc(eq(PageRequest.of(0, 20))))
                .thenReturn(page);

        IngredientListResponse result = ingredientService.listIngredients(0, null);

        IngredientItemResponse item = result.items().get(0);
        assertThat(item.protein()).isNull();
        assertThat(item.fat()).isNull();
        assertThat(item.carbohydrates()).isNull();
    }

    @Test
    void shouldCreateNewIngredientWithBTW() {
        CreateIngredientRequest request = new CreateIngredientRequest(
            "Jajko",
            BigDecimal.valueOf(13.0),
            BigDecimal.valueOf(11.0),
            BigDecimal.valueOf(1.1)
        );

        Ingredient saved = new Ingredient();
        saved.setId(UUID.randomUUID());
        saved.setName("Jajko");
        saved.setNormalizedName("jajko");
        saved.setProtein(BigDecimal.valueOf(13.0));
        saved.setFat(BigDecimal.valueOf(11.0));
        saved.setCarbohydrates(BigDecimal.valueOf(1.1));

        when(ingredientRepository.findByNormalizedName("jajko")).thenReturn(Optional.empty());
        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(saved);

        IngredientResponse result = ingredientService.createIngredient(request);

        assertThat(result.name()).isEqualTo("Jajko");
        assertThat(result.protein()).isEqualTo(BigDecimal.valueOf(13.0));
        assertThat(result.fat()).isEqualTo(BigDecimal.valueOf(11.0));
        assertThat(result.carbohydrates()).isEqualTo(BigDecimal.valueOf(1.1));
        verify(ingredientRepository).save(any(Ingredient.class));
    }

    @Test
    void shouldRejectCreatingDuplicateIngredient() {
        CreateIngredientRequest request = new CreateIngredientRequest(
            "Cukier", null, null, null
        );

        Ingredient existing = new Ingredient();
        existing.setNormalizedName("cukier");

        when(ingredientRepository.findByNormalizedName("cukier"))
                .thenReturn(Optional.of(existing));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientService.createIngredient(request));

        assertThat(exception.getMessage()).contains("już istnieje");
    }

    @Test
    void shouldUpdateIngredient() {
        UUID id = UUID.randomUUID();
        UpdateIngredientRequest request = new UpdateIngredientRequest(
            "Kurczak",
            BigDecimal.valueOf(31.0),
            BigDecimal.valueOf(3.6),
            BigDecimal.ZERO
        );

        Ingredient existing = createTestIngredient(id, "Kurczak", "kurczak", null, null, null);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(existing));

        Ingredient updated = createTestIngredient(id, "Kurczak", "kurczak",
            BigDecimal.valueOf(31.0), BigDecimal.valueOf(3.6), BigDecimal.ZERO);
        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(updated);

        IngredientResponse result = ingredientService.updateIngredient(id, request);

        assertThat(result.protein()).isEqualTo(BigDecimal.valueOf(31.0));
        assertThat(result.fat()).isEqualTo(BigDecimal.valueOf(3.6));
        assertThat(result.carbohydrates()).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    void shouldRejectUpdatingToExistingName() {
        UUID id = UUID.randomUUID();
        UpdateIngredientRequest request = new UpdateIngredientRequest("Manna", null, null, null);

        Ingredient existing = createTestIngredient(id, "Semolina", "semolina", null, null, null);
        Ingredient other = createTestIngredient(UUID.randomUUID(), "Manna", "manna", null, null, null);

        when(ingredientRepository.findById(id)).thenReturn(Optional.of(existing));
        when(ingredientRepository.findByNormalizedName("manna")).thenReturn(Optional.of(other));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientService.updateIngredient(id, request));

        assertThat(exception.getMessage()).contains("już istnieje");
    }

    @Test
    void shouldDeleteIngredient() {
        UUID id = UUID.randomUUID();
        when(ingredientRepository.existsById(id)).thenReturn(true);

        ingredientService.deleteIngredient(id);

        verify(ingredientRepository).deleteById(id);
    }

    @Test
    void shouldRejectDeletingNonexistentIngredient() {
        UUID id = UUID.randomUUID();
        when(ingredientRepository.existsById(id)).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ingredientService.deleteIngredient(id));

        assertThat(exception.getMessage()).isEqualTo("Składnik nie znaleziony.");
    }

    @Test
    void shouldGetIngredientById() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = createTestIngredient(id, "Mąka", "mąka",
            BigDecimal.valueOf(10.0), BigDecimal.valueOf(2.0), BigDecimal.valueOf(75.0));

        when(ingredientRepository.findById(id)).thenReturn(Optional.of(ingredient));

        IngredientResponse result = ingredientService.getIngredientById(id);

        assertThat(result.id()).isEqualTo(id);
        assertThat(result.name()).isEqualTo("Mąka");
    }

    private Ingredient createTestIngredient(UUID id, String name, String normalizedName, 
            BigDecimal protein, BigDecimal fat, BigDecimal carbohydrates) {
        Ingredient ingredient = new Ingredient();
        ingredient.setId(id);
        ingredient.setName(name);
        ingredient.setNormalizedName(normalizedName);
        ingredient.setProtein(protein);
        ingredient.setFat(fat);
        ingredient.setCarbohydrates(carbohydrates);
        return ingredient;
    }
}
