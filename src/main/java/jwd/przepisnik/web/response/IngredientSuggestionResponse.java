package jwd.przepisnik.web.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class IngredientSuggestionResponse {
    UUID id;
    String name;
}
