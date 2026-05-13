import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RecipeForm from './RecipeForm';
import { RecipeResponse } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import constants from '../../../constants';

const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText('Nazwa przepisu *'), { target: { value: 'Zupa' } });
    fireEvent.change(screen.getByLabelText('Opis przygotowania *'), {
        target: { value: 'Gotuj wszystkie skladniki przez 30 minut.' },
    });
    fireEvent.change(screen.getByLabelText('Czas przygotowania (min) *'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Liczba porcji *'), { target: { value: '4' } });
    // ingredient name placeholder input
    const nameInputs = screen.getAllByPlaceholderText('Nazwa składnika');
    fireEvent.change(nameInputs[0], { target: { value: 'Sol' } });
};

describe('RecipeForm', () => {
    test('submits edited recipe when initial ingredient quantity comes as a number', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);

        const initialData: RecipeResponse = {
            id: '4a6be7d2-4141-4dc3-a93f-6754959534d2',
            name: 'Nalesniki',
            description: 'Usmaz cienkie nalesniki na patelni.',
            preparationTimeMinutes: 20,
            servings: 2,
            isPrivate: false,
            author: 'jan',
            createdAt: '2026-04-10T10:00:00',
            updatedAt: '2026-04-10T10:00:00',
            ingredients: [
                {
                    name: 'Maka',
                    quantity: 250,
                    unit: 'GRAM',
                },
            ],
        };

        render(<RecipeForm initialData={initialData} onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText('Nazwa przepisu *'), {
            target: { value: 'Nalesniki bezglutenowe' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmiany' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Nalesniki bezglutenowe',
                description: 'Usmaz cienkie nalesniki na patelni.',
                isPrivate: false,
                ingredients: [
                    expect.objectContaining({
                        quantity: '250',
                    }),
                ],
            }));
        });
    });

    test('shows validation errors when empty form is submitted', async () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await screen.findByText('Nazwa przepisu jest wymagana.');
        expect(screen.getByText('Opis przygotowania jest wymagany.')).toBeInTheDocument();
        expect(screen.getByText('Czas przygotowania musi być liczbą większą od 0.')).toBeInTheDocument();
        expect(screen.getByText('Liczba porcji musi być liczbą większą od 0.')).toBeInTheDocument();
        expect(screen.getByText('Dodaj co najmniej jeden składnik.')).toBeInTheDocument();
    });

    test('clears name validation error after user enters value', async () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));
        expect(await screen.findByText('Nazwa przepisu jest wymagana.')).toBeInTheDocument();

        const nameInput = screen.getByLabelText('Nazwa przepisu *');
        fireEvent.change(nameInput, { target: { value: 'Pierogi' } });

        expect(screen.queryByText('Nazwa przepisu jest wymagana.')).not.toBeInTheDocument();
        expect(nameInput).not.toHaveClass('field-invalid');
    });

    test('shows duplicate ingredient error when two ingredients share the same name', async () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        fireEvent.change(screen.getByLabelText('Nazwa przepisu *'), { target: { value: 'Zupa' } });
        fireEvent.change(screen.getByLabelText('Opis przygotowania *'), {
            target: { value: 'Opis przygotowania.' },
        });
        fireEvent.change(screen.getByLabelText('Czas przygotowania (min) *'), { target: { value: '30' } });
        fireEvent.change(screen.getByLabelText('Liczba porcji *'), { target: { value: '2' } });

        const nameInputs = screen.getAllByPlaceholderText('Nazwa składnika');
        fireEvent.change(nameInputs[0], { target: { value: 'Sol' } });

        fireEvent.click(screen.getByRole('button', { name: '+ Dodaj składnik' }));

        const updatedNameInputs = screen.getAllByPlaceholderText('Nazwa składnika');
        fireEvent.change(updatedNameInputs[1], { target: { value: 'Sol' } });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(screen.getByText('Nazwy składników muszą być unikalne.')).toBeInTheDocument();
        });
    });

    test('can add a new ingredient row', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        expect(screen.getAllByPlaceholderText('Nazwa składnika')).toHaveLength(1);

        fireEvent.click(screen.getByRole('button', { name: '+ Dodaj składnik' }));

        expect(screen.getAllByPlaceholderText('Nazwa składnika')).toHaveLength(2);
    });

    test('add ingredient action uses dashed button styling', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        expect(screen.getByRole('button', { name: '+ Dodaj składnik' })).toHaveClass(
            'button',
            'dashed',
        );
    });

    test('can remove an ingredient row when there are multiple', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: '+ Dodaj składnik' }));
        expect(screen.getAllByPlaceholderText('Nazwa składnika')).toHaveLength(2);

        fireEvent.click(screen.getAllByRole('button', { name: '✕' })[0]);

        expect(screen.getAllByPlaceholderText('Nazwa składnika')).toHaveLength(1);
    });

    test('can change ingredient quantity and unit', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();

        const quantityInputs = screen.getAllByPlaceholderText('Ilość');
        fireEvent.change(quantityInputs[0], { target: { value: '100' } });

        const unitSelect = screen.getByDisplayValue(constants.recipes.form.units.GRAM);
        fireEvent.change(unitSelect, { target: { value: 'ML' } });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                ingredients: [expect.objectContaining({ quantity: '100', unit: 'ML' })],
            }));
        });
    });

    test('shows all supported ingredient units in selector', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        const unitSelect = screen.getByDisplayValue(
            constants.recipes.form.units.GRAM,
        ) as HTMLSelectElement;
        const optionValues = Array.from(unitSelect.options).map((option) => option.value);

        expect(optionValues).toEqual([
            'GRAM',
            'KG',
            'ML',
            'L',
            'PIECE',
            'TABLESPOON',
            'TEASPOON',
            'CUP',
        ]);
    });

    test('shows submit error message when onSubmit throws', async () => {
        const onSubmit = jest.fn().mockRejectedValue(new Error('Server error'));
        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        const quantityInputs = screen.getAllByPlaceholderText('Ilość');
        fireEvent.change(quantityInputs[0], { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Coś poszło nie tak. Spróbuj ponownie.');
        });
    });

    test('maps backend ingredient quantity error to the row field', async () => {
        const onSubmit = jest
            .fn()
            .mockRejectedValue(new ApiError(400, ['data.ingredients[0].quantity: nie może mieć wartości null']));

        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        const quantityInput = screen.getAllByPlaceholderText('Ilość')[0];
        fireEvent.change(quantityInput, { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(screen.getByText('Ilosc skladnika jest wymagana.')).toBeInTheDocument();
        });

        expect(quantityInput).toHaveClass('field-invalid');
    });

    test('clears ingredient quantity error when user enters value', async () => {
        const onSubmit = jest
            .fn()
            .mockRejectedValue(new ApiError(400, ['data.ingredients[0].quantity: nie może mieć wartości null']));

        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        const quantityInput = screen.getAllByPlaceholderText('Ilość')[0];
        fireEvent.change(quantityInput, { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(screen.getByText('Ilosc skladnika jest wymagana.')).toBeInTheDocument();
        });

        fireEvent.change(quantityInput, { target: { value: '250' } });

        expect(screen.queryByText('Ilosc skladnika jest wymagana.')).not.toBeInTheDocument();
        expect(quantityInput).not.toHaveClass('field-invalid');
    });

    test('remove button is not shown when only one ingredient exists', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        expect(screen.queryByRole('button', { name: '✕' })).not.toBeInTheDocument();
    });

    test('submits recipe as public by default', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        fireEvent.change(screen.getAllByPlaceholderText('Ilość')[0], { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ isPrivate: false }));
        });
    });

    test('submits recipe as private when privacy select is set to Prywatny', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        fireEvent.change(screen.getAllByPlaceholderText('Ilość')[0], { target: { value: '100' } });
        const privacySelect = screen.getByLabelText('Prywatność przepisu') as HTMLSelectElement;
        fireEvent.change(privacySelect, { target: { value: 'private' } });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ isPrivate: true }));
        });
    });
});
