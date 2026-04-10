import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RecipeForm from './RecipeForm';
import { RecipeResponse } from '../../../api/recipesApi';

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
});
