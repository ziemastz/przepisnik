import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MyRecipesPage from './MyRecipesPage';
import { recipesApi, RecipeResponse } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';

const mockNavigate = jest.fn();

jest.mock('../../../router', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../api/recipesApi', () => ({
    recipesApi: {
        getMyRecipes: jest.fn(),
        deleteRecipe: jest.fn(),
    },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

const makeRecipe = (overrides: Partial<RecipeResponse> = {}): RecipeResponse => ({
    id: 'r1',
    name: 'Nalesniki',
    preparationTimeMinutes: 20,
    servings: 2,
    author: 'jan',
    createdAt: '2026-04-10T10:00:00',
    updatedAt: '2026-04-10T10:00:00',
    ingredients: [{ name: 'Maka', quantity: '250', unit: 'GRAM' }],
    ...overrides,
});

describe('MyRecipesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows loading indicator initially', () => {
        mockedRecipesApi.getMyRecipes.mockReturnValue(new Promise(() => undefined));

        render(<MyRecipesPage />);

        expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
    });

    test('renders list of recipes after loading', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
    });

    test('shows empty state when no recipes returned', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([]);

        render(<MyRecipesPage />);

        await screen.findByText('Nie masz jeszcze żadnych przepisów.');
    });

    test('shows error message when loading fails', async () => {
        mockedRecipesApi.getMyRecipes.mockRejectedValue(new Error('Network error'));

        render(<MyRecipesPage />);

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Nie udało się załadować przepisów.',
            ),
        );
    });

    test('shows ApiError message when loading fails with ApiError', async () => {
        mockedRecipesApi.getMyRecipes.mockRejectedValue(
            new ApiError(500, ['Błąd serwera']),
        );

        render(<MyRecipesPage />);

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent('Błąd serwera'),
        );
    });

    test('navigates to edit page when Edytuj is clicked', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe({ id: 'r1' })]);

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Edytuj' }));

        expect(mockNavigate).toHaveBeenCalledWith('/recipes/r1/edit');
    });

    test('navigates to new recipe page when + Dodaj przepis is clicked', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([]);

        render(<MyRecipesPage />);

        await screen.findByText('Nie masz jeszcze żadnych przepisów.');
        fireEvent.click(screen.getAllByRole('button', { name: '+ Dodaj przepis' })[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/recipes/new');
    });

    test('shows delete confirmation dialog when Usuń is clicked', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Usunąć przepis\?/)).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toHaveTextContent('Nalesniki');
    });

    test('removes recipe from list after confirmed delete', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);
        mockedRecipesApi.deleteRecipe.mockResolvedValue(undefined);

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));
        // the dialog confirm button is also named 'Usuń'; pick it by grabbing all and the last one
        fireEvent.click(screen.getAllByRole('button', { name: 'Usuń' })[1]);

        await waitFor(() =>
            expect(screen.queryByText('Nalesniki')).not.toBeInTheDocument(),
        );
    });

    test('closes dialog without deleting when Anuluj is clicked', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));
        fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(mockedRecipesApi.deleteRecipe).not.toHaveBeenCalled();
    });

    test('shows error when delete fails', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);
        mockedRecipesApi.deleteRecipe.mockRejectedValue(new Error('fail'));

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));
        fireEvent.click(screen.getAllByRole('button', { name: 'Usuń' })[1]);

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Nie udało się usunąć przepisu.',
            ),
        );
    });

    test('shows ApiError message when delete fails with ApiError', async () => {
        mockedRecipesApi.getMyRecipes.mockResolvedValue([makeRecipe()]);
        mockedRecipesApi.deleteRecipe.mockRejectedValue(
            new ApiError(403, ['Brak uprawnień']),
        );

        render(<MyRecipesPage />);

        await screen.findByText('Nalesniki');
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));
        fireEvent.click(screen.getAllByRole('button', { name: 'Usuń' })[1]);

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent('Brak uprawnień'),
        );
    });
});
