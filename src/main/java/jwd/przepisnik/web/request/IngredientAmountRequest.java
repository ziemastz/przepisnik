package jwd.przepisnik.web.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jwd.przepisnik.models.IngredientUnit;
import lombok.Data;

@Data
public class IngredientAmountRequest {
    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal quantity;

    @NotNull
    private IngredientUnit unit;
}
