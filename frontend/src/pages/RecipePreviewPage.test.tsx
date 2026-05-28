import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import RecipePreviewPage from './RecipePreviewPage';
import { recipesApi, RecipeResponse } from '../api/recipesApi';
import constants from '../constants';

const mockUseParams: jest.Mock<{ id?: string }, []> = jest.fn(() => ({ id: 'recipe-1' }));

jest.mock('../router', () => ({
    Link: ({ to, className, children }: { to: string; className?: string; children: ReactNode }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
    useParams: () => mockUseParams(),
}));

jest.mock('../api/recipesApi', () => ({
    recipesApi: {
        getPublicRecipeById: jest.fn(),
    },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

const sampleRecipe: RecipeResponse = {
    id: 'recipe-1',
    name: 'domowy chleb',
    description: 'Wymieszaj skladniki i piecz przez 45 minut.',
    preparationTimeMinutes: 60,
    servings: 8,
    isPrivate: false,
    author: 'anna',
    createdAt: '2026-01-01T10:00:00',
    updatedAt: '2026-01-01T10:00:00',
    ingredients: [
        {
            name: 'maka pszenna',
            quantity: '500',
            unit: 'GRAM',
            nutritionalValues: { protein: 10.126, fat: 2, carbohydrates: 75.5 },
        },
        {
            name: 'woda',
            quantity: '320',
            unit: 'ML',
            nutritionalValues: { protein: 0, fat: 0, carbohydrates: 0 },
        },
    ],
    nutritionalValues: {
        protein: 0,
        fat: 0,
        carbohydrates: 0,
    },
    nutritionalValuesPerProtein: {
        protein: 0,
        fat: 0,
        carbohydrates: 0,
    },
};

describe('RecipePreviewPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'recipe-1' });
    });

    test('shows loading state and calls public recipe endpoint with route id', async () => {
        let resolveRecipe: ((value: RecipeResponse) => void) | undefined;
        mockedRecipesApi.getPublicRecipeById.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRecipe = resolve;
                }),
        );

        render(<RecipePreviewPage />);

        expect(screen.getByText(constants.recipes.preview.loading)).toBeInTheDocument();
        expect(mockedRecipesApi.getPublicRecipeById).toHaveBeenCalledWith('recipe-1');

        resolveRecipe?.(sampleRecipe);

        expect(await screen.findByRole('heading', { name: 'Domowy chleb' })).toBeInTheDocument();
    });

    test('renders recipe details with normalized names, units and BTW values', async () => {
        mockedRecipesApi.getPublicRecipeById.mockResolvedValue(sampleRecipe);

        render(<RecipePreviewPage />);

        expect(await screen.findByRole('heading', { name: 'Domowy chleb' })).toBeInTheDocument();
        expect(screen.getByText(constants.recipes.preview.ingredientsHeading)).toBeInTheDocument();
        expect(screen.getByText('Maka pszenna')).toBeInTheDocument();
        expect(screen.getByText('Woda')).toBeInTheDocument();
        expect(screen.getByText('500 g')).toBeInTheDocument();
        expect(screen.getByText('320 ml')).toBeInTheDocument();
        expect(screen.getByText('Wymieszaj skladniki i piecz przez 45 minut.')).toBeInTheDocument();
        expect(screen.getByText(/Autor:\s*anna/)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${constants.recipes.list.createdPrefix}`))).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/B: 10.13g T: 2g W: 75.5g/)).toBeInTheDocument();
        });

        expect(screen.getByText('B: 0g T: 0g W: 0g')).toBeInTheDocument();
    });

    test('shows load error when recipe request fails', async () => {
        mockedRecipesApi.getPublicRecipeById.mockRejectedValue(new Error('Request failed'));

        render(<RecipePreviewPage />);

        expect(await screen.findByText(constants.recipes.preview.loadError)).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: constants.recipes.preview.backToHome }),
        ).toHaveAttribute('href', constants.routes.home);
    });

    test('shows load error and does not call API when route id is missing', async () => {
        mockUseParams.mockReturnValue({});

        render(<RecipePreviewPage />);

        expect(await screen.findByText(constants.recipes.preview.loadError)).toBeInTheDocument();
        expect(mockedRecipesApi.getPublicRecipeById).not.toHaveBeenCalled();
    });
});
