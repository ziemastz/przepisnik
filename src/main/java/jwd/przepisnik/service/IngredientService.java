package jwd.przepisnik.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jwd.przepisnik.repository.IngredientRepository;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@Service
public class IngredientService {
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 20;

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

    private String normalizeQuery(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Query cannot be empty.");
        }

        return query.trim().toLowerCase(Locale.ROOT);
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null) {
            return DEFAULT_LIMIT;
        }

        if (limit < 1) {
            throw new IllegalArgumentException("Limit must be greater than zero.");
        }

        return Math.min(limit, MAX_LIMIT);
    }
}
