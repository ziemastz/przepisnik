import { recipesApi } from './recipesApi';
import { apiClient } from './apiClient';

jest.mock('./apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        postVoid: jest.fn(),
    },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockRecipe = {
    id: 'abc',
    name: 'Nalesniki',
    description: 'Usmaz nalesniki na patelni.',
    preparationTimeMinutes: 20,
    servings: 2,
    author: 'jan',
    createdAt: '2026-04-10T10:00:00',
    updatedAt: '2026-04-10T10:00:00',
    ingredients: [{ name: 'Maka', quantity: '250', unit: 'GRAM' as const }],
};

describe('recipesApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createRecipe calls apiClient.post with correct args and returns recipe', async () => {
        mockedApiClient.post.mockResolvedValue(mockRecipe);

        const payload = {
            name: 'Nalesniki',
            description: 'Usmaz nalesniki na patelni.',
            preparationTimeMinutes: 20,
            servings: 2,
            isPrivate: false,
            ingredients: [{ name: 'Maka', quantity: '250', unit: 'GRAM' as const }],
        };

        const result = await recipesApi.createRecipe(payload);

        expect(mockedApiClient.post).toHaveBeenCalledWith(
            '/api/recipes/create',
            { data: payload },
            true,
        );
        expect(result).toBe(mockRecipe);
    });

    test('getMyRecipes calls apiClient.get and returns list', async () => {
        mockedApiClient.get.mockResolvedValue([mockRecipe]);

        const result = await recipesApi.getMyRecipes();

        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/recipes/my', true);
        expect(result).toEqual([mockRecipe]);
    });

    test('getRecipeById calls apiClient.get with correct id', async () => {
        mockedApiClient.get.mockResolvedValue(mockRecipe);

        const result = await recipesApi.getRecipeById('abc');

        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/recipes/abc', true);
        expect(result).toBe(mockRecipe);
    });

    test('updateRecipe calls apiClient.post with correct args', async () => {
        const updated = { ...mockRecipe, name: 'Updated' };
        mockedApiClient.post.mockResolvedValue(updated);

        const payload = {
            name: 'Updated',
            description: 'Nowy opis przygotowania.',
            preparationTimeMinutes: 20,
            servings: 2,
            isPrivate: false,
            ingredients: [],
        };

        const result = await recipesApi.updateRecipe('abc', payload);

        expect(mockedApiClient.post).toHaveBeenCalledWith(
            '/api/recipes/update/abc',
            { data: payload },
            true,
        );
        expect(result).toBe(updated);
    });

    test('deleteRecipe calls apiClient.postVoid with correct args', async () => {
        mockedApiClient.postVoid.mockResolvedValue(undefined);

        await recipesApi.deleteRecipe('abc');

        expect(mockedApiClient.postVoid).toHaveBeenCalledWith(
            '/api/recipes/delete/abc',
            { data: {} },
            true,
        );
    });
});
