import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RecipeFormPage from './RecipeFormPage';
import { recipesApi, RecipeResponse } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import { useNavigate, useParams } from '../../../router';

const mockNavigate = jest.fn();

jest.mock('../../../router', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../../../api/recipesApi', () => ({
    recipesApi: {
        createRecipe: jest.fn(),
        getRecipeById: jest.fn(),
        updateRecipe: jest.fn(),
    },
}));

jest.mock('../components/RecipeForm', () => ({
    __esModule: true,
    default: ({
        onSubmit,
        initialData,
    }: {
        onSubmit: (data: { name: string; preparationTimeMinutes: number; servings: number; ingredients: [] }) => Promise<void>;
        initialData: RecipeResponse | null;
    }) => (
        <div>
            {initialData && <span data-testid="initial-name">{initialData.name}</span>}
            <button
                onClick={() =>
                    void onSubmit({
                        name: 'Test recipe',
                        preparationTimeMinutes: 30,
                        servings: 4,
                        ingredients: [],
                    })
                }
            >
                Submit
            </button>
        </div>
    ),
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;

const mockRecipe: RecipeResponse = {
    id: 'recipe-1',
    name: 'Nalesniki',
    preparationTimeMinutes: 20,
    servings: 2,
    author: 'jan',
    createdAt: '2026-04-10T10:00:00',
    updatedAt: '2026-04-10T10:00:00',
    ingredients: [{ name: 'Maka', quantity: '250', unit: 'GRAM' }],
};

describe('RecipeFormPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseNavigate.mockReturnValue(mockNavigate);
    });

    describe('new recipe mode (no id)', () => {
        beforeEach(() => {
            mockedUseParams.mockReturnValue({});
        });

        test('renders new recipe heading', () => {
            render(<RecipeFormPage />);
            expect(screen.getByText('Dodaj nowy przepis')).toBeInTheDocument();
        });

        test('calls createRecipe and navigates to /my-recipes on submit', async () => {
            mockedRecipesApi.createRecipe.mockResolvedValue(mockRecipe);

            render(<RecipeFormPage />);
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() => expect(mockedRecipesApi.createRecipe).toHaveBeenCalled());
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/my-recipes'));
        });

        test('shows error message when createRecipe fails', async () => {
            mockedRecipesApi.createRecipe.mockRejectedValue(new Error('fail'));

            render(<RecipeFormPage />);
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() =>
                expect(screen.getByRole('alert')).toHaveTextContent(
                    'Nie udało się zapisać przepisu.',
                ),
            );
        });

        test('shows ApiError message when createRecipe fails with ApiError', async () => {
            mockedRecipesApi.createRecipe.mockRejectedValue(
                new ApiError(400, ['Nieprawidłowe dane']),
            );

            render(<RecipeFormPage />);
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() =>
                expect(screen.getByRole('alert')).toHaveTextContent('Nieprawidłowe dane'),
            );
        });
    });

    describe('edit mode (with id)', () => {
        beforeEach(() => {
            mockedUseParams.mockReturnValue({ id: 'recipe-1' });
        });

        test('shows loading indicator while fetching recipe', () => {
            mockedRecipesApi.getRecipeById.mockReturnValue(new Promise(() => undefined));

            render(<RecipeFormPage />);

            expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
        });

        test('renders edit heading and passes initialData after loading', async () => {
            mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipe);

            render(<RecipeFormPage />);

            await screen.findByText('Edytuj przepis');
            expect(screen.getByTestId('initial-name')).toHaveTextContent('Nalesniki');
        });

        test('calls updateRecipe and navigates on submit', async () => {
            mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipe);
            mockedRecipesApi.updateRecipe.mockResolvedValue(mockRecipe);

            render(<RecipeFormPage />);

            await screen.findByText('Edytuj przepis');
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() => expect(mockedRecipesApi.updateRecipe).toHaveBeenCalledWith('recipe-1', expect.any(Object)));
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/my-recipes'));
        });

        test('shows error when getRecipeById fails', async () => {
            mockedRecipesApi.getRecipeById.mockRejectedValue(new Error('load fail'));

            render(<RecipeFormPage />);

            await waitFor(() =>
                expect(screen.getByRole('alert')).toHaveTextContent(
                    'Nie udało się załadować przepisu.',
                ),
            );
        });

        test('shows ApiError message when load fails with ApiError', async () => {
            mockedRecipesApi.getRecipeById.mockRejectedValue(
                new ApiError(404, ['Przepis nie istnieje']),
            );

            render(<RecipeFormPage />);

            await waitFor(() =>
                expect(screen.getByRole('alert')).toHaveTextContent('Przepis nie istnieje'),
            );
        });

        test('shows error when updateRecipe fails', async () => {
            mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipe);
            mockedRecipesApi.updateRecipe.mockRejectedValue(new Error('update fail'));

            render(<RecipeFormPage />);

            await screen.findByText('Edytuj przepis');
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() =>
                expect(screen.getByRole('alert')).toHaveTextContent(
                    'Nie udało się zapisać przepisu.',
                ),
            );
        });
    });
});
