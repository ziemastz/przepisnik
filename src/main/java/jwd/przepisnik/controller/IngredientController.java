package jwd.przepisnik.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jwd.przepisnik.constants.ApiPaths;
import jwd.przepisnik.constants.AppMessages;
import jwd.przepisnik.service.IngredientService;
import jwd.przepisnik.web.request.CreateIngredientRequest;
import jwd.przepisnik.web.request.UpdateIngredientRequest;
import jwd.przepisnik.web.response.BaseResponse;
import jwd.przepisnik.web.response.IngredientListResponse;
import jwd.przepisnik.web.response.IngredientResponse;
import jwd.przepisnik.web.response.IngredientSuggestionResponse;

@RestController
@RequestMapping(ApiPaths.Ingredients.BASE)
public class IngredientController {
    private static final String INGREDIENT_ALREADY_EXISTS_MESSAGE = "już istnieje";
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping(ApiPaths.Ingredients.SEARCH)
    public ResponseEntity<BaseResponse<List<IngredientSuggestionResponse>>> searchIngredients(
            @RequestParam(ApiPaths.Ingredients.QUERY_PARAM) String query,
            @RequestParam(value = ApiPaths.Ingredients.LIMIT_PARAM, required = false) Integer limit,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        List<IngredientSuggestionResponse> suggestions = ingredientService.searchIngredients(query, limit);
        return ResponseEntity.ok(BaseResponse.success(suggestions));
    }

    @GetMapping(ApiPaths.Ingredients.LIST)
    public ResponseEntity<BaseResponse<IngredientListResponse>> listIngredients(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "search", required = false) String search) {
        IngredientListResponse ingredients = ingredientService.listIngredients(page, search);
        return ResponseEntity.ok(BaseResponse.success(ingredients));
    }

    @GetMapping(ApiPaths.Ingredients.BY_ID)
    public ResponseEntity<BaseResponse<IngredientResponse>> getIngredientById(
            @PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            IngredientResponse ingredient = ingredientService.getIngredientById(uuid);
            return ResponseEntity.ok(BaseResponse.success(ingredient));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.failure(e.getMessage()));
        }
    }

    @PostMapping(ApiPaths.Ingredients.CREATE)
    public ResponseEntity<BaseResponse<IngredientResponse>> createIngredient(
            @Valid @RequestBody CreateIngredientRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        try {
            IngredientResponse ingredient = ingredientService.createIngredient(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.success(ingredient));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.failure(e.getMessage()));
        }
    }

    @PutMapping(ApiPaths.Ingredients.UPDATE_BY_ID)
    public ResponseEntity<BaseResponse<IngredientResponse>> updateIngredient(
            @PathVariable String id,
            @Valid @RequestBody UpdateIngredientRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        try {
            UUID uuid = UUID.fromString(id);
            IngredientResponse ingredient = ingredientService.updateIngredient(uuid, request);
            return ResponseEntity.ok(BaseResponse.success(ingredient));
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage() != null && e.getMessage().contains(INGREDIENT_ALREADY_EXISTS_MESSAGE)
                    ? HttpStatus.BAD_REQUEST
                    : HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status)
                .body(BaseResponse.failure(e.getMessage()));
        }
    }

    @DeleteMapping(ApiPaths.Ingredients.DELETE_BY_ID)
    public ResponseEntity<BaseResponse<?>> deleteIngredient(
            @PathVariable String id,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.failure(AppMessages.Controller.AUTH_USER_MISSING));
        }

        try {
            UUID uuid = UUID.fromString(id);
            ingredientService.deleteIngredient(uuid);
            return ResponseEntity.ok(BaseResponse.success(null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.failure(e.getMessage()));
        }
    }
}
