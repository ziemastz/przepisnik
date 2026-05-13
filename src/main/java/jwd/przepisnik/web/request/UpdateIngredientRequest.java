package jwd.przepisnik.web.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;

public record UpdateIngredientRequest(
        @NotBlank String name,
        @DecimalMin("0.00") @DecimalMax("9999.99") BigDecimal protein,
        @DecimalMin("0.00") @DecimalMax("9999.99") BigDecimal fat,
        @DecimalMin("0.00") @DecimalMax("9999.99") BigDecimal carbohydrates) {
}
