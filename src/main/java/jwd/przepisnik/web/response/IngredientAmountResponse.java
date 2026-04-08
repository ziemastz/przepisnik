package jwd.przepisnik.web.response;

import java.math.BigDecimal;

import jwd.przepisnik.models.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class IngredientAmountResponse {
    String name;
    BigDecimal quantity;
    IngredientUnit unit;
}
