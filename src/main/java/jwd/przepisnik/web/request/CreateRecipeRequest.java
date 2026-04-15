package jwd.przepisnik.web.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateRecipeRequest(
        @NotBlank String name,
        @NotBlank String description,
        @NotNull @Positive Integer preparationTimeMinutes,
        @NotNull @Positive Integer servings,
        Boolean isPrivate,
        @NotEmpty List<@Valid IngredientAmountRequest> ingredients) {
}
