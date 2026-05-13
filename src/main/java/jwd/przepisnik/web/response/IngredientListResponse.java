package jwd.przepisnik.web.response;

import java.util.List;

public record IngredientListResponse(
        List<IngredientItemResponse> items,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize) {
}
