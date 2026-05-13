import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { recipesApi, RecipeResponse } from '../api/recipesApi';
import constants from '../constants';

let mockedNavigate: jest.Mock;

jest.mock('../router', () => ({
    useNavigate: () => mockedNavigate,
}));

jest.mock('../api/recipesApi', () => ({
    recipesApi: {
        getPublicRecipes: jest.fn(),
    },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

const sampleRecipe: RecipeResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Nalesniki',
    description: 'Wymieszaj i usmaż.',
    preparationTimeMinutes: 20,
    servings: 4,
    isPrivate: false,
    author: 'jan',
    createdAt: '2025-01-15T10:00:00',
    updatedAt: '2025-01-15T10:00:00',
    ingredients: [
        { name: 'Maka', quantity: '250', unit: 'GRAM' },
    ],
};

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedNavigate = jest.fn();
    });

    test('renders heading and search form', async () => {
        mockedRecipesApi.getPublicRecipes.mockResolvedValue([]);

        render(<HomePage />);

        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByRole('search')).toBeInTheDocument();
        // Wait for async state updates to settle inside act()
        await screen.findByText(constants.home.empty);
    });

    test('shows loading state initially', () => {
        mockedRecipesApi.getPublicRecipes.mockReturnValue(new Promise((_resolve) => { /* pending */ }));

        render(<HomePage />);

        expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();
    });

    test('renders recipe cards after fetch', async () => {
        mockedRecipesApi.getPublicRecipes.mockResolvedValue([sampleRecipe]);

        render(<HomePage />);

        expect(await screen.findByText('Nalesniki')).toBeInTheDocument();
        expect(mockedRecipesApi.getPublicRecipes).toHaveBeenCalledWith(undefined);
    });

    test('shows empty message when no recipes returned', async () => {
        mockedRecipesApi.getPublicRecipes.mockResolvedValue([]);

        render(<HomePage />);

        expect(await screen.findByText(constants.home.empty)).toBeInTheDocument();
    });

    test('shows error message when fetch fails', async () => {
        mockedRecipesApi.getPublicRecipes.mockRejectedValue(new Error('network'));

        render(<HomePage />);

        expect(await screen.findByText(constants.home.loadError)).toBeInTheDocument();
    });

    test('submits search query on form submit', async () => {
        mockedRecipesApi.getPublicRecipes
            .mockResolvedValueOnce([])
            .mockResolvedValue([sampleRecipe]);

        render(<HomePage />);

        await screen.findByText(constants.home.empty);

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nale' } });
        fireEvent.submit(screen.getByRole('search'));

        expect(await screen.findByText('Nalesniki')).toBeInTheDocument();
        expect(mockedRecipesApi.getPublicRecipes).toHaveBeenLastCalledWith('nale');
    });

    test('clears search and reloads all recipes', async () => {
        mockedRecipesApi.getPublicRecipes
            .mockResolvedValueOnce([sampleRecipe])
            .mockResolvedValue([sampleRecipe]);

        render(<HomePage />);

        await screen.findByText('Nalesniki');

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abc' } });

        const clearBtn = screen.getByLabelText(/wyczyść/i);
        fireEvent.click(clearBtn);

        await waitFor(() =>
            expect(mockedRecipesApi.getPublicRecipes).toHaveBeenLastCalledWith(undefined),
        );
    });

    test('shows empty search message when query yields no results', async () => {
        mockedRecipesApi.getPublicRecipes
            .mockResolvedValueOnce([sampleRecipe])
            .mockResolvedValue([]);

        render(<HomePage />);

        await screen.findByText('Nalesniki');

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xyz' } });
        fireEvent.submit(screen.getByRole('search'));

        expect(await screen.findByText(constants.home.emptySearch)).toBeInTheDocument();
    });

    test('opens recipe preview page after clicking recipe card action', async () => {
        mockedRecipesApi.getPublicRecipes.mockResolvedValue([sampleRecipe]);

        render(<HomePage />);

        const openButton = await screen.findByRole('button', {
            name: constants.home.openRecipeButton,
        });
        fireEvent.click(openButton);

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/recipes/11111111-1111-1111-1111-111111111111');
        });
    });
});
