package jwd.przepisnik.web.response;

import java.math.BigDecimal;

import jwd.przepisnik.models.IngredientUnit;

public record IngredientAmountResponse(
        String name,
        BigDecimal quantity,
        IngredientUnit unit) {
}
