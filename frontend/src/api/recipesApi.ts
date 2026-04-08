import { apiClient } from './apiClient';

export interface IngredientAmountRequest {
    name: string;
    quantity: string;
    unit: 'GRAM' | 'ML' | 'PIECE' | 'TABLESPOON' | 'TEASPOON' | 'CUP';
}

export interface CreateRecipeRequest {
    name: string;
    preparationTimeMinutes: number;
    servings: number;
    ingredients: IngredientAmountRequest[];
}

export interface UpdateRecipeRequest {
    name: string;
    preparationTimeMinutes: number;
    servings: number;
    ingredients: IngredientAmountRequest[];
}

export interface IngredientAmountResponse {
    name: string;
    quantity: string;
    unit: 'GRAM' | 'ML' | 'PIECE' | 'TABLESPOON' | 'TEASPOON' | 'CUP';
}

export interface RecipeResponse {
    id: string;
    name: string;
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
            '/api/recipes/create',
            {
                data: payload,
            },
            true,
        );
    },

    async getMyRecipes(): Promise<RecipeResponse[]> {
        return apiClient.get<RecipeResponse[]>('/api/recipes/my', true);
    },

    async getRecipeById(id: string): Promise<RecipeResponse> {
        return apiClient.get<RecipeResponse>(`/api/recipes/${id}`, true);
    },

    async updateRecipe(id: string, payload: UpdateRecipeRequest): Promise<RecipeResponse> {
        return apiClient.post<RecipeResponse, { data: UpdateRecipeRequest }>(
            `/api/recipes/update/${id}`,
            {
                data: payload,
            },
            true,
        );
    },

    async deleteRecipe(id: string): Promise<null> {
        return apiClient.post<null, { data: {} }>(
            `/api/recipes/delete/${id}`,
            {
                data: {},
            },
            true,
        );
    },
};
