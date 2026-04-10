import { fireEvent, render, screen } from '@testing-library/react';
import RecipeList from './RecipeList';
import { RecipeResponse } from '../../../api/recipesApi';

const makeRecipe = (overrides: Partial<RecipeResponse> = {}): RecipeResponse => ({
    id: '1',
    name: 'Nalesniki',
    preparationTimeMinutes: 20,
    servings: 2,
    author: 'jan',
    createdAt: '2026-04-10T10:00:00',
    updatedAt: '2026-04-10T10:00:00',
    ingredients: [{ name: 'Maka', quantity: '250', unit: 'GRAM' }],
    ...overrides,
});

describe('RecipeList', () => {
    test('renders recipe name, preparation time, servings and ingredients', () => {
        render(<RecipeList recipes={[makeRecipe()]} onEdit={jest.fn()} onDelete={jest.fn()} />);

        expect(screen.getByText('Nalesniki')).toBeInTheDocument();
        expect(screen.getByText(/20 min/)).toBeInTheDocument();
        expect(screen.getByText(/2 porcji/)).toBeInTheDocument();
        expect(screen.getByText(/Maka/)).toBeInTheDocument();
    });

    test('calls onEdit with recipe id when Edytuj is clicked', () => {
        const onEdit = jest.fn();
        render(<RecipeList recipes={[makeRecipe({ id: 'recipe-42' })]} onEdit={onEdit} onDelete={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Edytuj' }));

        expect(onEdit).toHaveBeenCalledWith('recipe-42');
    });

    test('calls onDelete with recipe id when Usuń is clicked', () => {
        const onDelete = jest.fn();
        render(<RecipeList recipes={[makeRecipe({ id: 'recipe-7' })]} onEdit={jest.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));

        expect(onDelete).toHaveBeenCalledWith('recipe-7');
    });

    test('renders multiple recipes', () => {
        const recipes = [
            makeRecipe({ id: '1', name: 'Nalesniki' }),
            makeRecipe({ id: '2', name: 'Zupa pomidorowa' }),
        ];
        render(<RecipeList recipes={recipes} onEdit={jest.fn()} onDelete={jest.fn()} />);

        expect(screen.getByText('Nalesniki')).toBeInTheDocument();
        expect(screen.getByText('Zupa pomidorowa')).toBeInTheDocument();
    });

    test('renders creation date in Polish locale format', () => {
        render(
            <RecipeList
                recipes={[makeRecipe({ createdAt: '2026-04-10T10:00:00' })]}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.getByText(/Utworzony:/)).toBeInTheDocument();
    });

    test('renders ingredient quantity and unit', () => {
        render(
            <RecipeList
                recipes={[makeRecipe({ ingredients: [{ name: 'Cukier', quantity: '2', unit: 'TABLESPOON' }] })]}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.getByText(/Cukier/)).toBeInTheDocument();
        expect(screen.getByText(/TABLESPOON/)).toBeInTheDocument();
    });
});
