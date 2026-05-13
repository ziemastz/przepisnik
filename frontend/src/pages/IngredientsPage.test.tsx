import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IngredientsPage from './IngredientsPage';
import * as ingredientsApi from '../api/ingredientsApi';
import constants from '../constants';

let mockAuthState = {
    isAuthenticated: true,
};

jest.mock('../features/auth/AuthContext', () => ({
    useAuth: () => mockAuthState,
}));

jest.mock('../api/ingredientsApi', () => ({
    ingredientsApi: {
        listIngredients: jest.fn(),
        getIngredientById: jest.fn(),
        createIngredient: jest.fn(),
        updateIngredient: jest.fn(),
        deleteIngredient: jest.fn(),
    },
}));

jest.mock('../features/ingredients/IngredientDialog', () => ({
    __esModule: true,
    default: ({ onClose, onSave }: { onClose: () => void; onSave: () => void }) => (
        <div data-testid="ingredient-dialog">
            <h2>Dialog</h2>
            <button onClick={onSave}>Save</button>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

const mockIngredientList = {
    items: [
        {
            id: '1',
            name: 'Mąka',
            protein: 10.0,
            fat: 2.0,
            carbohydrates: 75.0,
        },
        {
            id: '2',
            name: 'Mleko',
            protein: 3.2,
            fat: 3.6,
            carbohydrates: 4.8,
        },
    ],
    totalPages: 1,
    totalElements: 2,
    currentPage: 0,
    pageSize: 20,
};

describe('IngredientsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuthState = { isAuthenticated: true };
        (ingredientsApi.ingredientsApi.listIngredients as jest.Mock).mockResolvedValue(mockIngredientList);
    });

    test('displays ingredients list on load', async () => {
        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText('Mąka')).toBeInTheDocument();
        });
        expect(screen.getByText('Mleko')).toBeInTheDocument();
    });

    test('displays BTW values correctly formatted to 2 decimals', async () => {
        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText('10.00')).toBeInTheDocument();
        });
        expect(screen.getByText('3.20')).toBeInTheDocument();
    });

    test('displays shared nutrition header and no Przepiśnik table headers', async () => {
        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText(constants.ingredients.list.btw)).toBeInTheDocument();
        });

        expect(
            screen.queryAllByRole('columnheader', { name: constants.titleApp })
        ).toHaveLength(0);
    });

    test('displays dash when BTW values are null', async () => {
        const listWithNullBTW = {
            ...mockIngredientList,
            items: [
                {
                    id: '3',
                    name: 'Sól',
                    protein: null,
                    fat: null,
                    carbohydrates: null,
                },
            ],
        };

        (ingredientsApi.ingredientsApi.listIngredients as jest.Mock).mockResolvedValue(listWithNullBTW);

        render(<IngredientsPage />);

        await waitFor(() => {
            const dashes = screen.getAllByText('-');
            expect(dashes.length).toBeGreaterThan(0);
        });
    });

    test('shows add button only for authenticated users', async () => {
        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText('+ Dodaj składnik')).toBeInTheDocument();
        });
    });

    test('hides add button for unauthenticated users', async () => {
        mockAuthState = { isAuthenticated: false };
        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.queryByText('+ Dodaj składnik')).not.toBeInTheDocument();
        });
    });

    test('opens dialog when add button is clicked', async () => {
        render(<IngredientsPage />);

        const addButton = await screen.findByText('+ Dodaj składnik');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId('ingredient-dialog')).toBeInTheDocument();
        });
    });

    test('searches ingredients when search button is clicked', async () => {
        render(<IngredientsPage />);

        const searchInput = await screen.findByPlaceholderText(constants.ingredients.list.searchPlaceholder);
        fireEvent.change(searchInput, { target: { value: 'mleko' } });

        const searchButton = screen.getByText(constants.ingredients.list.searchButton);
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(ingredientsApi.ingredientsApi.listIngredients).toHaveBeenCalledWith(0, 'mleko');
        });
    });

    test('clears search input when clear button is clicked', async () => {
        render(<IngredientsPage />);

        const searchInput = (await screen.findByPlaceholderText(constants.ingredients.list.searchPlaceholder)) as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: 'test' } });

        const clearButton = screen.getByLabelText(constants.ingredients.list.clearButton);
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(searchInput.value).toBe('');
        });
    });

    test('displays pagination controls when there are multiple pages', async () => {
        const multiPageList = {
            ...mockIngredientList,
            totalPages: 3,
            totalElements: 60,
        };

        (ingredientsApi.ingredientsApi.listIngredients as jest.Mock).mockResolvedValue(multiPageList);

        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText(constants.ingredients.list.paginationPrev)).toBeDisabled();
        });
        expect(screen.getByText(constants.ingredients.list.paginationNext)).not.toBeDisabled();
    });

    test('displays error message when list loading fails', async () => {
        (ingredientsApi.ingredientsApi.listIngredients as jest.Mock).mockRejectedValue(new Error('Błąd pobierania'));

        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText(constants.ingredients.list.loadError)).toBeInTheDocument();
        });
    });

    test('displays empty state when no ingredients are found', async () => {
        const emptyList = {
            ...mockIngredientList,
            items: [],
            totalElements: 0,
        };

        (ingredientsApi.ingredientsApi.listIngredients as jest.Mock).mockResolvedValue(emptyList);

        render(<IngredientsPage />);

        await waitFor(() => {
            expect(screen.getByText(constants.ingredients.list.empty)).toBeInTheDocument();
        });
    });
});
