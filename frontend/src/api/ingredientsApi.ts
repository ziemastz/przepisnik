import { apiClient } from './apiClient';
import constants from '../constants';

export interface IngredientBTW {
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
}

export interface CreateIngredientRequest {
    name: string;
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
}

export interface UpdateIngredientRequest {
    name: string;
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
}

export interface IngredientItemResponse {
    id: string;
    name: string;
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
}

export interface IngredientListResponse {
    items: IngredientItemResponse[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

export interface IngredientResponse {
    id: string;
    name: string;
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
}

export const ingredientsApi = {
    async listIngredients(page = 0, search?: string): Promise<IngredientListResponse> {
        const url = search
            ? `${constants.api.ingredients.list}?page=${page}&search=${encodeURIComponent(search)}`
            : `${constants.api.ingredients.list}?page=${page}`;
        return apiClient.get<IngredientListResponse>(url, false);
    },

    async getIngredientById(id: string): Promise<IngredientResponse> {
        return apiClient.get<IngredientResponse>(constants.api.ingredients.byId(id), false);
    },

    async createIngredient(payload: CreateIngredientRequest): Promise<IngredientResponse> {
        return apiClient.post<IngredientResponse, CreateIngredientRequest>(
            constants.api.ingredients.create,
            payload,
            true,
        );
    },

    async updateIngredient(id: string, payload: UpdateIngredientRequest): Promise<IngredientResponse> {
        return apiClient.put<IngredientResponse, UpdateIngredientRequest>(
            constants.api.ingredients.update(id),
            payload,
            true,
        );
    },

    async deleteIngredient(id: string): Promise<void> {
        return apiClient.deleteVoid(constants.api.ingredients.delete(id), true);
    },
};
