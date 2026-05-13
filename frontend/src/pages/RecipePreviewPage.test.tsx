import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import RecipePreviewPage from './RecipePreviewPage';
import { recipesApi, RecipeResponse } from '../api/recipesApi';
import { ingredientsApi } from '../api/ingredientsApi';
import constants from '../constants';

jest.mock('../router', () => ({
    Link: ({ to, className, children }: { to: string; className?: string; children: ReactNode }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
    useParams: () => ({ id: 'recipe-1' }),
}));

jest.mock('../api/recipesApi', () => ({
    recipesApi: {
        getRecipeById: jest.fn(),
    },
}));

jest.mock('../api/ingredientsApi', () => ({
    ingredientsApi: {
        listIngredients: jest.fn(),
    },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;
const mockedIngredientsApi = ingredientsApi as jest.Mocked<typeof ingredientsApi>;

const sampleRecipe: RecipeResponse = {
    id: 'recipe-1',
    name: 'Domowy chleb',
    description: 'Wymieszaj skladniki i piecz przez 45 minut.',
    preparationTimeMinutes: 60,
    servings: 8,
    isPrivate: false,
    author: 'anna',
    createdAt: '2026-01-01T10:00:00',
    updatedAt: '2026-01-01T10:00:00',
    ingredients: [
        { name: 'Maka pszenna', quantity: '500', unit: 'GRAM' },
        { name: 'Woda', quantity: '320', unit: 'ML' },
    ],
};

describe('RecipePreviewPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recipe details and BTW shorthand for ingredients', async () => {
        mockedRecipesApi.getRecipeById.mockResolvedValue(sampleRecipe);
        mockedIngredientsApi.listIngredients.mockImplementation(async (_page, search) => {
            if (search === 'Maka pszenna') {
                return {
                    items: [
                        {
                            id: 'ing-1',
                            name: 'Maka pszenna',
                            protein: 10,
                            fat: 2,
                            carbohydrates: 75,
                        },
                    ],
                    totalPages: 1,
                    totalElements: 1,
                    currentPage: 0,
                    pageSize: 20,
                };
            }

            return {
                items: [
                    {
                        id: 'ing-2',
                        name: 'Woda',
                        protein: 0,
                        fat: 0,
                        carbohydrates: 0,
                    },
                ],
                totalPages: 1,
                totalElements: 1,
                currentPage: 0,
                pageSize: 20,
            };
        });

        render(<RecipePreviewPage />);

        expect(await screen.findByRole('heading', { name: 'Domowy chleb' })).toBeInTheDocument();
        expect(screen.getByText(constants.recipes.preview.ingredientsHeading)).toBeInTheDocument();
        expect(screen.getByText('Maka pszenna')).toBeInTheDocument();
        expect(screen.getByText('Wymieszaj skladniki i piecz przez 45 minut.')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/B:10g T:2g W:75g/)).toBeInTheDocument();
        });
    });

    test('shows load error when recipe request fails', async () => {
        mockedRecipesApi.getRecipeById.mockRejectedValue(new Error('Request failed'));
        mockedIngredientsApi.listIngredients.mockResolvedValue({
            items: [],
            totalPages: 0,
            totalElements: 0,
            currentPage: 0,
            pageSize: 20,
        });

        render(<RecipePreviewPage />);

        expect(await screen.findByText(constants.recipes.preview.loadError)).toBeInTheDocument();
    });
});
