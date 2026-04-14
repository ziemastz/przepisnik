package jwd.przepisnik.web.request;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.web.json.LenientBigDecimalDeserializer;

public record IngredientAmountRequest(
        @NotBlank String name,
        @NotNull @DecimalMin("0.01") @JsonDeserialize(using = LenientBigDecimalDeserializer.class) BigDecimal quantity,
        @NotNull IngredientUnit unit) {
}
