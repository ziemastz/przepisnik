package jwd.przepisnik.service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.Ingredient;
import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.web.request.CreateIngredientRequest;
import jwd.przepisnik.web.request.UpdateIngredientRequest;
import jwd.przepisnik.web.response.IngredientItemResponse;
import jwd.przepisnik.web.response.IngredientListResponse;
import jwd.przepisnik.web.response.IngredientResponse;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@Service
public class IngredientService {
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 20;
    private static final int DEFAULT_PAGE_SIZE = 20;

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @Transactional(readOnly = true)
    public List<IngredientSuggestionResponse> searchIngredients(String query, Integer limit) {
        String normalizedQuery = normalizeQuery(query);
        int safeLimit = normalizeLimit(limit);

        return ingredientRepository
                .findByNormalizedNameStartingWithOrderByNormalizedNameAsc(
                        normalizedQuery,
                        PageRequest.of(0, safeLimit))
                .stream()
                .map(ingredient -> new IngredientSuggestionResponse(ingredient.getId(), ingredient.getName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public IngredientListResponse listIngredients(Integer page, String search) {
        if (page == null || page < 0) {
            page = 0;
        }

        Page<Ingredient> pageResult;
        if (search != null && !search.isBlank()) {
            String normalizedSearch = search.trim().toLowerCase(Locale.ROOT);
            pageResult = ingredientRepository
                    .findByNormalizedNameContainingOrderByNameAsc(
                            normalizedSearch,
                            PageRequest.of(page, DEFAULT_PAGE_SIZE));
        } else {
            pageResult = ingredientRepository
                    .findAllByOrderByNameAsc(PageRequest.of(page, DEFAULT_PAGE_SIZE));
        }

        List<IngredientItemResponse> items = pageResult.getContent()
                .stream()
                .map(this::toItemResponse)
                .toList();

        return new IngredientListResponse(
                items,
                pageResult.getTotalPages(),
                pageResult.getTotalElements(),
                pageResult.getNumber(),
                DEFAULT_PAGE_SIZE);
    }

    @Transactional
    public IngredientResponse createIngredient(CreateIngredientRequest request) {
        String name = request.name().trim();
        String normalizedName = normalizeIngredientName(name);

        // Check if ingredient already exists
        if (ingredientRepository.findByNormalizedName(normalizedName).isPresent()) {
            throw new IllegalArgumentException("Składnik '" + name + "' już istnieje.");
        }

        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        ingredient.setNormalizedName(normalizedName);
        ingredient.setProtein(request.protein());
        ingredient.setFat(request.fat());
        ingredient.setCarbohydrates(request.carbohydrates());

        Ingredient saved = ingredientRepository.save(ingredient);
        return toResponse(saved);
    }

    @Transactional
    public IngredientResponse updateIngredient(UUID id, UpdateIngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Składnik nie znaleziony."));

        String name = request.name().trim();
        String normalizedName = normalizeIngredientName(name);

        // Check if new name already exists (excluding current ingredient)
        if (!ingredient.getNormalizedName().equals(normalizedName) &&
                ingredientRepository.findByNormalizedName(normalizedName).isPresent()) {
            throw new IllegalArgumentException("Składnik '" + name + "' już istnieje.");
        }

        ingredient.setName(name);
        ingredient.setNormalizedName(normalizedName);
        ingredient.setProtein(request.protein());
        ingredient.setFat(request.fat());
        ingredient.setCarbohydrates(request.carbohydrates());

        Ingredient updated = ingredientRepository.save(ingredient);
        return toResponse(updated);
    }

    @Transactional
    public void deleteIngredient(UUID id) {
        if (!ingredientRepository.existsById(id)) {
            throw new IllegalArgumentException("Składnik nie znaleziony.");
        }
        ingredientRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public IngredientResponse getIngredientById(UUID id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Składnik nie znaleziony."));
        return toResponse(ingredient);
    }

    private IngredientResponse toResponse(Ingredient ingredient) {
        return new IngredientResponse(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getProtein(),
                ingredient.getFat(),
                ingredient.getCarbohydrates());
    }

    private IngredientItemResponse toItemResponse(Ingredient ingredient) {
        return new IngredientItemResponse(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getProtein(),
                ingredient.getFat(),
                ingredient.getCarbohydrates());
    }

    private String normalizeQuery(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(AppMessages.Service.INGREDIENT_QUERY_EMPTY);
        }

        return query.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeIngredientName(String ingredientName) {
        return ingredientName.trim().toLowerCase(Locale.ROOT);
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null) {
            return DEFAULT_LIMIT;
        }

        if (limit < 1) {
            throw new IllegalArgumentException(AppMessages.Service.INGREDIENT_LIMIT_POSITIVE);
        }

        return Math.min(limit, MAX_LIMIT);
    }
}

