import { apiClient } from './apiClient';
import constants from '../constants';

export interface IngredientAmountRequest {
    name: string;
    quantity: string;
    unit: 'GRAM' | 'KG' | 'ML' | 'L' | 'PIECE' | 'TABLESPOON' | 'TEASPOON' | 'CUP';
}

export interface CreateRecipeRequest {
    name: string;
    description: string;
    preparationTimeMinutes: number;
    servings: number;
    ingredients: IngredientAmountRequest[];
}

export interface UpdateRecipeRequest {
    name: string;
    description: string;
    preparationTimeMinutes: number;
    servings: number;
    ingredients: IngredientAmountRequest[];
}

export interface IngredientAmountResponse {
    name: string;
    quantity: string | number;
    unit: 'GRAM' | 'KG' | 'ML' | 'L' | 'PIECE' | 'TABLESPOON' | 'TEASPOON' | 'CUP';
}

export interface RecipeResponse {
    id: string;
    name: string;
    description: string;
    preparationTimeMinutes: number;
    servings: number;
    author: string;
    createdAt: string;
    updatedAt: string;
    ingredients: IngredientAmountResponse[];
}

export const recipesApi = {
    async createRecipe(payload: CreateRecipeRequest): Promise<RecipeResponse> {
        return apiClient.post<RecipeResponse, { data: CreateRecipeRequest }>(
            constants.api.recipes.create,
            {
                data: payload,
            },
            true,
        );
    },

    async getMyRecipes(): Promise<RecipeResponse[]> {
        return apiClient.get<RecipeResponse[]>(constants.api.recipes.my, true);
    },

    async getRecipeById(id: string): Promise<RecipeResponse> {
        return apiClient.get<RecipeResponse>(constants.api.recipes.byId(id), true);
    },

    async updateRecipe(id: string, payload: UpdateRecipeRequest): Promise<RecipeResponse> {
        return apiClient.post<RecipeResponse, { data: UpdateRecipeRequest }>(
            constants.api.recipes.update(id),
            {
                data: payload,
            },
            true,
        );
    },

    async deleteRecipe(id: string): Promise<void> {
        return apiClient.postVoid<{ data: Record<string, never> }>(
            constants.api.recipes.delete(id),
            {
                data: {},
            },
            true,
        );
    },
};
