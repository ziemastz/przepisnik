package jwd.przepisnik.web.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record RecipeResponse(
        UUID id,
        String name,
        String description,
        Integer preparationTimeMinutes,
        Integer servings,
        Boolean isPrivate,
        String author,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<IngredientAmountResponse> ingredients) {
}
