import { useState } from 'react';
import {
    RecipeResponse,
    CreateRecipeRequest,
    IngredientAmountRequest,
} from '../../../api/recipesApi';
import Button from '../../../shared/button/Button';

interface RecipeFormProps {
    initialData?: RecipeResponse | null;
    onSubmit: (data: CreateRecipeRequest) => Promise<void>;
}

interface FormErrors {
    name?: string;
    description?: string;
    preparationTimeMinutes?: string;
    servings?: string;
    ingredients?: string;
    submit?: string;
}

const RecipeForm = ({ initialData, onSubmit }: RecipeFormProps) => {
    const [name, setName] = useState(initialData?.name ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [preparationTimeMinutes, setPreparationTimeMinutes] = useState(
        initialData?.preparationTimeMinutes?.toString() ?? '',
    );
    const [servings, setServings] = useState(initialData?.servings?.toString() ?? '');
    const [ingredients, setIngredients] = useState<IngredientAmountRequest[]>(
        initialData?.ingredients.map((ing) => ({ ...ing, quantity: String(ing.quantity) })) ?? [
            { name: '', quantity: '', unit: 'GRAM' },
        ],
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nazwa przepisu jest wymagana.';
        }

        if (!description.trim()) {
            newErrors.description = 'Opis przygotowania jest wymagany.';
        }

        const prepTime = parseInt(preparationTimeMinutes);
        if (!preparationTimeMinutes || isNaN(prepTime) || prepTime <= 0) {
            newErrors.preparationTimeMinutes = 'Czas przygotowania musi być liczbą większą od 0.';
        }

        const servingsNum = parseInt(servings);
        if (!servings || isNaN(servingsNum) || servingsNum <= 0) {
            newErrors.servings = 'Liczba porcji musi być liczbą większą od 0.';
        }

        const validIngredients = ingredients.filter((ing) => ing.name.trim());
        if (validIngredients.length === 0) {
            newErrors.ingredients = 'Dodaj co najmniej jeden składnik.';
        }

        const ingredientNames = new Set<string>();
        for (const ing of validIngredients) {
            const normalized = ing.name.trim().toLowerCase();
            if (ingredientNames.has(normalized)) {
                newErrors.ingredients = 'Nazwy składników muszą być unikalne.';
                break;
            }
            ingredientNames.add(normalized);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: 'GRAM' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (
        index: number,
        field: 'name' | 'quantity' | 'unit',
        value: string,
    ) => {
        const updated = [...ingredients];
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});
            const validIngredients = ingredients
                .filter((ing) => ing.name.trim())
                .map((ing) => ({
                    ...ing,
                    quantity: ing.quantity.trim().replace(',', '.'),
                }));
            const data: CreateRecipeRequest = {
                name: name.trim(),
                description: description.trim(),
                preparationTimeMinutes: parseInt(preparationTimeMinutes),
                servings: parseInt(servings),
                ingredients: validIngredients,
            };
            await onSubmit(data);
        } catch (err) {
            setErrors({ submit: 'Coś poszło nie tak. Spróbuj ponownie.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="recipe-form">
            {errors.submit && (
                <div role="alert" className="recipe-form-submit-error">
                    {errors.submit}
                </div>
            )}

            <div className="auth-field">
                <label htmlFor="recipe-name">Nazwa przepisu *</label>
                <input
                    id="recipe-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="np. Nalesniki"
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <div role="alert" className="recipe-field-error">
                        {errors.name}
                    </div>
                )}
            </div>

            <div className="recipe-form-row">
                <div className="auth-field">
                    <label htmlFor="recipe-time">Czas przygotowania (min) *</label>
                    <input
                        id="recipe-time"
                        type="number"
                        value={preparationTimeMinutes}
                        onChange={(e) => setPreparationTimeMinutes(e.target.value)}
                        placeholder="20"
                        min="1"
                        disabled={isSubmitting}
                    />
                    {errors.preparationTimeMinutes && (
                        <div role="alert" className="recipe-field-error">
                            {errors.preparationTimeMinutes}
                        </div>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="recipe-servings">Liczba porcji *</label>
                    <input
                        id="recipe-servings"
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        placeholder="4"
                        min="1"
                        disabled={isSubmitting}
                    />
                    {errors.servings && (
                        <div role="alert" className="recipe-field-error">
                            {errors.servings}
                        </div>
                    )}
                </div>
            </div>

            <div className="recipe-ingredients-section">
                <label>Składniki *</label>
                {errors.ingredients && (
                    <div role="alert" className="recipe-field-error">
                        {errors.ingredients}
                    </div>
                )}
                <div className="recipe-ingredients-list">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="recipe-ingredient-row">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'name', e.target.value)
                                }
                                placeholder="Nazwa składnika"
                                disabled={isSubmitting}
                            />
                            <input
                                type="text"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'quantity', e.target.value)
                                }
                                placeholder="Ilość"
                                disabled={isSubmitting}
                            />
                            <select
                                value={ingredient.unit}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'unit', e.target.value)
                                }
                                disabled={isSubmitting}
                            >
                                <option value="GRAM">gram</option>
                                <option value="KG">kg</option>
                                <option value="ML">ml</option>
                                <option value="L">l</option>
                                <option value="PIECE">szt.</option>
                                <option value="TABLESPOON">łyżka</option>
                                <option value="TEASPOON">łyżeczka</option>
                                <option value="CUP">szklanka</option>
                            </select>
                            {ingredients.length > 1 && (
                                <Button
                                    type="secondary"
                                    onClick={() => handleRemoveIngredient(index)}
                                    isDisabled={isSubmitting}
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <Button type="dashed" onClick={handleAddIngredient} isDisabled={isSubmitting}>
                    + Dodaj składnik
                </Button>
            </div>
            <div className="auth-field">
                <label htmlFor="recipe-description">Opis przygotowania *</label>
                <textarea
                    id="recipe-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opisz kroki przygotowania potrawy"
                    rows={4}
                    disabled={isSubmitting}
                />
                {errors.description && (
                    <div role="alert" className="recipe-field-error">
                        {errors.description}
                    </div>
                )}
            </div>
            <div className="recipe-form-actions">
                <Button type="primary" htmlType="submit" isDisabled={isSubmitting}>
                    {isSubmitting ? 'Zapisywanie...' : initialData ? 'Zapisz zmiany' : 'Zapisz'}
                </Button>
            </div>
        </form>
    );
};

export default RecipeForm;
