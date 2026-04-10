import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RecipeForm from './RecipeForm';
import { RecipeResponse } from '../../../api/recipesApi';

const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText('Nazwa przepisu *'), { target: { value: 'Zupa' } });
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
            preparationTimeMinutes: 20,
            servings: 2,
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
        expect(screen.getByText('Czas przygotowania musi być liczbą większą od 0.')).toBeInTheDocument();
        expect(screen.getByText('Liczba porcji musi być liczbą większą od 0.')).toBeInTheDocument();
        expect(screen.getByText('Dodaj co najmniej jeden składnik.')).toBeInTheDocument();
    });

    test('shows duplicate ingredient error when two ingredients share the same name', async () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        fireEvent.change(screen.getByLabelText('Nazwa przepisu *'), { target: { value: 'Zupa' } });
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

        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'ML' } });

        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                ingredients: [expect.objectContaining({ quantity: '100', unit: 'ML' })],
            }));
        });
    });

    test('shows submit error message when onSubmit throws', async () => {
        const onSubmit = jest.fn().mockRejectedValue(new Error('Server error'));
        render(<RecipeForm onSubmit={onSubmit} />);

        fillValidForm();
        fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Coś poszło nie tak. Spróbuj ponownie.');
        });
    });

    test('remove button is not shown when only one ingredient exists', () => {
        render(<RecipeForm onSubmit={jest.fn()} />);

        expect(screen.queryByRole('button', { name: '✕' })).not.toBeInTheDocument();
    });
});
