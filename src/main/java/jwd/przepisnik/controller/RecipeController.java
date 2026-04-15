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

import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.Valid;
import jwd.przepisnik.constants.ApiPaths;
import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.models.Recipe;
import jwd.przepisnik.service.RecipeService;
import jwd.przepisnik.web.mapper.RecipeMapper;
import jwd.przepisnik.web.request.BaseRequest;
import jwd.przepisnik.web.request.CreateRecipeRequest;
import jwd.przepisnik.web.request.UpdateRecipeRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.RecipeResponse;

@RestController
@RequestMapping(ApiPaths.Recipes.BASE)
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;

    public RecipeController(RecipeService recipeService, RecipeMapper recipeMapper) {
        this.recipeService = recipeService;
        this.recipeMapper = recipeMapper;
    }

    @GetMapping(ApiPaths.Recipes.PUBLIC)
    public ResponseEntity<BaseResponse<List<RecipeResponse>>> getPublicRecipes(
            @RequestParam(required = false) String query) {
        List<Recipe> recipes = recipeService.getPublicRecipes(query);
        return ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponses(recipes)));
    }

    @PostMapping(ApiPaths.Recipes.CREATE)
    public ResponseEntity<BaseResponse<RecipeResponse>> createRecipe(
            @Valid @RequestBody BaseRequest<CreateRecipeRequest> recipeRequest,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        if (recipeRequest == null || recipeRequest.data() == null) {
            return ResponseEntity.badRequest().body(BaseResponse.failure(AppMessages.Controller.MISSING_RECIPE_DATA));
        }

        Recipe createdRecipe = recipeService.createRecipe(recipeRequest.data(), principal.getName());
        return ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(createdRecipe)));
    }

    @GetMapping(ApiPaths.Recipes.BY_ID)
    public ResponseEntity<BaseResponse<RecipeResponse>> getRecipeById(@PathVariable UUID id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        return recipeService.getRecipeForUser(id, principal.getName())
                .map(recipe -> ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(recipe))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BaseResponse.failure(AppMessages.Controller.RECIPE_BY_ID_NOT_FOUND)));
    }

    @GetMapping(ApiPaths.Recipes.MY)
    public ResponseEntity<BaseResponse<List<RecipeResponse>>> getMyRecipes(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        List<Recipe> recipes = recipeService.getRecipesForUser(principal.getName());
        return ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponses(recipes)));
    }

    @PostMapping(ApiPaths.Recipes.UPDATE_BY_ID)
    public ResponseEntity<BaseResponse<RecipeResponse>> updateRecipe(
            @PathVariable UUID id,
            @Valid @RequestBody BaseRequest<UpdateRecipeRequest> recipeRequest,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        if (recipeRequest == null || recipeRequest.data() == null) {
            return ResponseEntity.badRequest().body(BaseResponse.failure(AppMessages.Controller.MISSING_RECIPE_DATA));
        }

        return recipeService.updateRecipe(id, recipeRequest.data(), principal.getName())
                .map(recipe -> ResponseEntity.ok(BaseResponse.success(recipeMapper.toResponse(recipe))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BaseResponse.failure(AppMessages.Controller.RECIPE_BY_ID_NOT_FOUND)));
    }

    @PostMapping(ApiPaths.Recipes.DELETE_BY_ID)
    public ResponseEntity<BaseResponse<Object>> deleteRecipe(@PathVariable UUID id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        boolean deleted = recipeService.deleteRecipe(id, principal.getName());

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.failure(AppMessages.Controller.RECIPE_BY_ID_NOT_FOUND));
        }

        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
