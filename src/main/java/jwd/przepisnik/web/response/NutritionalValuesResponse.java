package jwd.przepisnik.web.response;

import java.math.BigDecimal;

public record NutritionalValuesResponse(
        BigDecimal protein,
        BigDecimal fat,
        BigDecimal carbohydrates) {
}
