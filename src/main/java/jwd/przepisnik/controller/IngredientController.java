package jwd.przepisnik.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jwd.przepisnik.service.IngredientService;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/search")
    public ResponseEntity<BaseResponse<List<IngredientSuggestionResponse>>> searchIngredients(
            @RequestParam("query") String query,
            @RequestParam(value = "limit", required = false) Integer limit,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        List<IngredientSuggestionResponse> suggestions = ingredientService.searchIngredients(query, limit);
        return ResponseEntity.ok(BaseResponse.success(suggestions));
    }
}
