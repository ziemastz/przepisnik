package jwd.przepisnik.web.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateRecipeRequest {
    @NotBlank
    private String name;

    @NotNull
    @Positive
    private Integer preparationTimeMinutes;

    @NotNull
    @Positive
    private Integer servings;

    @NotEmpty
    private List<@Valid IngredientAmountRequest> ingredients;
}
