import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IngredientDialog from './IngredientDialog';
import * as ingredientsApi from '../../api/ingredientsApi';
import constants from '../../constants';

// Mock the API
jest.mock('../../api/ingredientsApi', () => ({
    ingredientsApi: {
        getIngredientById: jest.fn(),
        createIngredient: jest.fn(),
        updateIngredient: jest.fn(),
    },
}));

describe('IngredientDialog', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const getIngredientByIdMock = ingredientsApi.ingredientsApi.getIngredientById as jest.MockedFunction<
        typeof ingredientsApi.ingredientsApi.getIngredientById
    >;
    const createIngredientMock = ingredientsApi.ingredientsApi.createIngredient as jest.MockedFunction<
        typeof ingredientsApi.ingredientsApi.createIngredient
    >;
    const updateIngredientMock = ingredientsApi.ingredientsApi.updateIngredient as jest.MockedFunction<
        typeof ingredientsApi.ingredientsApi.updateIngredient
    >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders create dialog by default', () => {
        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('Dodaj składnik')).toBeInTheDocument();
    });

    test('renders edit dialog when ingredientId is provided', async () => {
        const mockIngredient = {
            id: '1',
            name: 'Mąka',
            protein: 10.0,
            fat: 2.0,
            carbohydrates: 75.0,
        };

        getIngredientByIdMock.mockResolvedValue(mockIngredient);

        render(
            <IngredientDialog
                ingredientId="1"
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Edytuj składnik')).toBeInTheDocument();
        });
        expect(screen.getByDisplayValue('Mąka')).toBeInTheDocument();
    });

    test('validates required fields', async () => {
        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Nazwa składnika jest wymagana.')).toBeInTheDocument();
        });
    });

    test('creates new ingredient with BTW values', async () => {
        createIngredientMock.mockResolvedValue({
            id: '1',
            name: 'Kurczak',
            protein: 31.0,
            fat: 3.6,
            carbohydrates: 0,
        });

        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const nameInput = screen.getByPlaceholderText('np. Mąka pszenna');
        const proteinInput = screen.getByPlaceholderText('10');
        const fatInput = screen.getByPlaceholderText('2');
        const carbsInputs = screen.getAllByPlaceholderText('75');

        fireEvent.change(nameInput, { target: { value: 'Kurczak' } });
        fireEvent.change(proteinInput, { target: { value: '31' } });
        fireEvent.change(fatInput, { target: { value: '3.6' } });
        fireEvent.change(carbsInputs[0], { target: { value: '0' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(ingredientsApi.ingredientsApi.createIngredient).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Kurczak',
                    protein: 31,
                    fat: 3.6,
                    carbohydrates: 0,
                })
            );
        });
        expect(mockOnSave).toHaveBeenCalled();
    });

    test('allows optional BTW values', async () => {
        createIngredientMock.mockResolvedValue({
            id: '1',
            name: 'Sól',
            protein: null,
            fat: null,
            carbohydrates: null,
        });

        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const nameInput = screen.getByPlaceholderText('np. Mąka pszenna');
        fireEvent.change(nameInput, { target: { value: 'Sól' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(ingredientsApi.ingredientsApi.createIngredient).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Sól',
                    protein: null,
                    fat: null,
                    carbohydrates: null,
                })
            );
        });
    });

    test('updates existing ingredient', async () => {
        const mockIngredient = {
            id: '1',
            name: 'Mąka',
            protein: 10.0,
            fat: 2.0,
            carbohydrates: 75.0,
        };

        getIngredientByIdMock.mockResolvedValue(mockIngredient);
        updateIngredientMock.mockResolvedValue({
            ...mockIngredient,
            protein: 12.0,
        });

        render(
            <IngredientDialog
                ingredientId="1"
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('10')).toBeInTheDocument();
        });

        const proteinInput = screen.getByDisplayValue('10');
        fireEvent.change(proteinInput, { target: { value: '12' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(ingredientsApi.ingredientsApi.updateIngredient).toHaveBeenCalled();
        });
        expect(mockOnSave).toHaveBeenCalled();
    });

    test('displays error when ingredient already exists', async () => {
        createIngredientMock.mockRejectedValue(
            new Error('Składnik już istnieje')
        );

        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const nameInput = screen.getByPlaceholderText('np. Mąka pszenna');
        fireEvent.change(nameInput, { target: { value: 'Mąka' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Składnik o tej nazwie już istnieje.')).toBeInTheDocument();
        });
    });

    test('closes dialog on cancel button click', () => {
        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const cancelButton = screen.getByText('Anuluj');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('disables form while saving', async () => {
        createIngredientMock.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve({
                id: '1',
                name: 'Test',
                protein: null,
                fat: null,
                carbohydrates: null,
            }), 100))
        );

        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const nameInput = screen.getByPlaceholderText('np. Mąka pszenna');
        fireEvent.change(nameInput, { target: { value: 'Test' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Zapisywanie...')).toBeInTheDocument();
        });
    });

    test('validates numeric BTW fields', async () => {
        render(
            <IngredientDialog
                ingredientId={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const nameInput = screen.getByPlaceholderText('np. Mąka pszenna');
        fireEvent.change(nameInput, { target: { value: 'Test' } });

        const proteinInputs = screen.getAllByPlaceholderText('10');
        fireEvent.change(proteinInputs[0], { target: { value: '1.234' } });

        const saveButton = screen.getByText('Zapisz');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText(constants.ingredients.form.errors.proteinInvalid)).toBeInTheDocument();
        });
    });
});
