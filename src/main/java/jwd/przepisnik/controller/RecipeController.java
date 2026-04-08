package jwd.przepisnik.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.service.RecipeService;
import jwd.przepisnik.web.mapper.RecipeMapper;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.CreateRecipeRequest;
import jwd.przepisnik.web.request.UpdateRecipeRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.RecipeResponse;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;

    public RecipeController(RecipeService recipeService, RecipeMapper recipeMapper) {
        this.recipeService = recipeService;
        this.recipeMapper = recipeMapper;
    }

    @PostMapping("/create")
    public ResponseEntity<BaseResponse<RecipeResponse>> createRecipe(
            @Valid @RequestBody BaseRequest<CreateRecipeRequest> recipeRequest,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        if (recipeRequest == null || recipeRequest.getData() == null) {
            return ResponseEntity.badRequest().body(BaseResponse.failure("Missing recipe data."));
        }

        Recipe createdRecipe = recipeService.createRecipe(recipeRequest.getData(), principal.getName());
        return ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(createdRecipe)));
    }

    @GetMapping("/{id:[0-9a-fA-F\\-]{36}}")
    public ResponseEntity<BaseResponse<RecipeResponse>> getRecipeById(@PathVariable UUID id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        return recipeService.getRecipeForUser(id, principal.getName())
                .map(recipe -> ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(recipe))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BaseResponse.failure("Przepis o podanym ID nie zostal znaleziony.")));
    }

    @GetMapping("/my")
    public ResponseEntity<BaseResponse<List<RecipeResponse>>> getMyRecipes(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        List<Recipe> recipes = recipeService.getRecipesForUser(principal.getName());
        return ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponses(recipes)));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<BaseResponse<RecipeResponse>> updateRecipe(
            @PathVariable UUID id,
            @Valid @RequestBody BaseRequest<UpdateRecipeRequest> recipeRequest,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        if (recipeRequest == null || recipeRequest.getData() == null) {
            return ResponseEntity.badRequest().body(BaseResponse.failure("Missing recipe data."));
        }

        return recipeService.updateRecipe(id, recipeRequest.getData(), principal.getName())
                .map(recipe -> ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(recipe))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BaseResponse.failure("Przepis o podanym ID nie zostal znaleziony.")));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<BaseResponse<Object>> deleteRecipe(@PathVariable UUID id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure("Brak uwierzytelnionego uzytkownika."));
        }

        boolean deleted = recipeService.deleteRecipe(id, principal.getName());

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.failure("Przepis o podanym ID nie zostal znaleziony."));
        }

        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
