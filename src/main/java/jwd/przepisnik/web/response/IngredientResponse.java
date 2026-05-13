package jwd.przepisnik.web.response;

import java.math.BigDecimal;
import java.util.UUID;

public record IngredientResponse(
        UUID id,
        String name,
        BigDecimal protein,
        BigDecimal fat,
        BigDecimal carbohydrates) {
}
