package jwd.przepisnik.web.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record RecipeResponse(
        UUID id,
        String name,
        Integer preparationTimeMinutes,
        Integer servings,
        String author,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<IngredientAmountResponse> ingredients) {
}
