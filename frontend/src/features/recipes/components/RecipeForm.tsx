import { useState } from 'react';
import {
    RecipeResponse,
    CreateRecipeRequest,
    IngredientAmountRequest,
} from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import { parseBackendFieldError, prettifyValidationMessage } from '../../../shared/forms/validation';
import Button from '../../../shared/button/Button';
import constants from '../../../constants';

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
    ingredientItems?: Record<number, Partial<Record<'name' | 'quantity' | 'unit', string>>>;
    submit?: string;
}

const toIngredientFieldMessage = (field: 'name' | 'quantity' | 'unit', baseMessage: string): string => {
    if (field === 'quantity' && baseMessage === constants.recipes.form.errors.requiredField) {
        return constants.recipes.form.errors.ingredientQuantityRequired;
    }

    if (field === 'name' && baseMessage === constants.recipes.form.errors.requiredField) {
        return constants.recipes.form.errors.ingredientNameRequired;
    }

    return baseMessage;
};

const getRecipeValidationErrors = (
    messages: string[],
    ingredientIndexMap: number[],
): FormErrors => {
    const mapped: FormErrors = {};
    const ingredientItems: Record<number, Partial<Record<'name' | 'quantity' | 'unit', string>>> = {};

    for (const message of messages) {
        const parsed = parseBackendFieldError(message);

        if (!parsed) {
            continue;
        }

        const [root, second, third] = parsed.path;

        if (root === 'name') {
            mapped.name = parsed.message;
            continue;
        }

        if (root === 'description') {
            mapped.description = parsed.message;
            continue;
        }

        if (root === 'preparationTimeMinutes') {
            mapped.preparationTimeMinutes = parsed.message;
            continue;
        }

        if (root === 'servings') {
            mapped.servings = parsed.message;
            continue;
        }

        if (root !== 'ingredients') {
            continue;
        }

        if (!second || !third) {
            mapped.ingredients = parsed.message;
            continue;
        }

        const sourceIndex = Number(second);
        if (!Number.isInteger(sourceIndex)) {
            mapped.ingredients = parsed.message;
            continue;
        }

        const ingredientIndex = ingredientIndexMap[sourceIndex] ?? sourceIndex;
        const normalizedField = third.toLowerCase();

        if (normalizedField !== 'name' && normalizedField !== 'quantity' && normalizedField !== 'unit') {
            mapped.ingredients = parsed.message;
            continue;
        }

        ingredientItems[ingredientIndex] = {
            ...ingredientItems[ingredientIndex],
            [normalizedField]: toIngredientFieldMessage(normalizedField, parsed.message),
        };
    }

    if (Object.keys(ingredientItems).length > 0) {
        mapped.ingredientItems = ingredientItems;
        if (!mapped.ingredients) {
            mapped.ingredients = constants.recipes.form.errors.ingredientFixHint;
        }
    }

    return mapped;
};

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

    const clearFieldError = (field: 'name' | 'description' | 'preparationTimeMinutes' | 'servings') => {
        setErrors((current) => {
            if (!current[field] && !current.submit) {
                return current;
            }

            return {
                ...current,
                [field]: undefined,
                submit: undefined,
            };
        });
    };

    const clearIngredientFieldError = (index: number, field: 'name' | 'quantity' | 'unit') => {
        setErrors((current) => {
            const rowErrors = current.ingredientItems?.[index];

            if (!rowErrors?.[field] && !current.ingredients && !current.submit) {
                return current;
            }

            const nextIngredientItems = { ...(current.ingredientItems ?? {}) };
            const nextRowErrors = { ...(nextIngredientItems[index] ?? {}) };
            delete nextRowErrors[field];

            if (Object.keys(nextRowErrors).length > 0) {
                nextIngredientItems[index] = nextRowErrors;
            } else {
                delete nextIngredientItems[index];
            }

            const hasAnyIngredientErrors = Object.keys(nextIngredientItems).length > 0;

            return {
                ...current,
                ingredientItems: hasAnyIngredientErrors ? nextIngredientItems : undefined,
                ingredients: hasAnyIngredientErrors ? current.ingredients : undefined,
                submit: undefined,
            };
        });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const ingredientItems: Record<number, Partial<Record<'name' | 'quantity' | 'unit', string>>> = {};

        if (!name.trim()) {
            newErrors.name = constants.recipes.form.errors.nameRequired;
        }

        if (!description.trim()) {
            newErrors.description = constants.recipes.form.errors.descriptionRequired;
        }

        const prepTime = parseInt(preparationTimeMinutes);
        if (!preparationTimeMinutes || isNaN(prepTime) || prepTime <= 0) {
            newErrors.preparationTimeMinutes = constants.recipes.form.errors.prepTimeInvalid;
        }

        const servingsNum = parseInt(servings);
        if (!servings || isNaN(servingsNum) || servingsNum <= 0) {
            newErrors.servings = constants.recipes.form.errors.servingsInvalid;
        }

        const validIngredients = ingredients.filter((ing) => ing.name.trim());
        if (validIngredients.length === 0) {
            newErrors.ingredients = constants.recipes.form.errors.ingredientRequired;
        }

        const ingredientNames = new Set<string>();
        for (const ing of validIngredients) {
            const normalized = ing.name.trim().toLowerCase();
            if (ingredientNames.has(normalized)) {
                newErrors.ingredients = constants.recipes.form.errors.ingredientUnique;
                break;
            }
            ingredientNames.add(normalized);
        }

        ingredients.forEach((ingredient, index) => {
            if (!ingredient.name.trim()) {
                return;
            }

            const normalizedQuantity = ingredient.quantity.trim().replace(',', '.');
            const quantityValue = Number(normalizedQuantity);

            if (!normalizedQuantity) {
                ingredientItems[index] = {
                    ...ingredientItems[index],
                    quantity: constants.recipes.form.errors.ingredientQuantityRequired,
                };
                return;
            }

            if (Number.isNaN(quantityValue) || quantityValue < 0.01) {
                ingredientItems[index] = {
                    ...ingredientItems[index],
                    quantity: constants.recipes.form.errors.ingredientQuantityMin,
                };
            }
        });

        if (Object.keys(ingredientItems).length > 0) {
            newErrors.ingredientItems = ingredientItems;
            if (!newErrors.ingredients) {
                newErrors.ingredients = constants.recipes.form.errors.ingredientFixHint;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: 'GRAM' }]);
        setErrors((current) => ({
            ...current,
            ingredients: undefined,
            submit: undefined,
        }));
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
        setErrors((current) => {
            const ingredientItems = current.ingredientItems;

            if (!ingredientItems && !current.ingredients && !current.submit) {
                return current;
            }

            const nextIngredientItems: Record<number, Partial<Record<'name' | 'quantity' | 'unit', string>>> = {};
            Object.entries(ingredientItems ?? {}).forEach(([key, value]) => {
                const numericKey = Number(key);
                if (Number.isNaN(numericKey) || numericKey === index) {
                    return;
                }

                const shiftedIndex = numericKey > index ? numericKey - 1 : numericKey;
                nextIngredientItems[shiftedIndex] = value;
            });

            const hasAnyIngredientErrors = Object.keys(nextIngredientItems).length > 0;

            return {
                ...current,
                ingredientItems: hasAnyIngredientErrors ? nextIngredientItems : undefined,
                ingredients: hasAnyIngredientErrors ? current.ingredients : undefined,
                submit: undefined,
            };
        });
    };

    const handleIngredientChange = (
        index: number,
        field: 'name' | 'quantity' | 'unit',
        value: string,
    ) => {
        const updated = [...ingredients];
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
        if (value.trim()) {
            clearIngredientFieldError(index, field);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const ingredientIndexMap: number[] = [];

        try {
            setIsSubmitting(true);
            setErrors({});
            const validIngredients = ingredients
                .map((ing, index) => ({
                    ingredient: ing,
                    index,
                }))
                .filter(({ ingredient }) => ingredient.name.trim())
                .map(({ ingredient, index }) => {
                    ingredientIndexMap.push(index);

                    return {
                        ...ingredient,
                        quantity: ingredient.quantity.trim().replace(',', '.'),
                    };
                });
            const data: CreateRecipeRequest = {
                name: name.trim(),
                description: description.trim(),
                preparationTimeMinutes: parseInt(preparationTimeMinutes),
                servings: parseInt(servings),
                ingredients: validIngredients,
            };
            await onSubmit(data);
        } catch (err) {
            if (err instanceof ApiError) {
                const validationErrors = getRecipeValidationErrors(err.messages, ingredientIndexMap);
                if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    return;
                }

                setErrors({
                    submit: prettifyValidationMessage(
                        err.messages[0] ?? constants.recipes.form.errors.submitFallback,
                    ),
                });
                return;
            }

            setErrors({ submit: constants.recipes.form.errors.submitFallback });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIngredientFieldError = (index: number, field: 'name' | 'quantity' | 'unit') =>
        errors.ingredientItems?.[index]?.[field];

    return (
        <form onSubmit={handleSubmit} className="recipe-form">
            {errors.submit && (
                <div role="alert" className="recipe-form-submit-error">
                    {errors.submit}
                </div>
            )}

            <div className="auth-field">
                <label htmlFor="recipe-name">{constants.recipes.form.labels.name}</label>
                <input
                    id="recipe-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim()) {
                            clearFieldError('name');
                        }
                    }}
                    placeholder={constants.recipes.form.placeholders.name}
                    className={errors.name ? 'field-invalid' : undefined}
                    aria-invalid={Boolean(errors.name)}
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
                    <label htmlFor="recipe-time">{constants.recipes.form.labels.preparationTime}</label>
                    <input
                        id="recipe-time"
                        type="number"
                        value={preparationTimeMinutes}
                        onChange={(e) => {
                            setPreparationTimeMinutes(e.target.value);
                            if (e.target.value.trim()) {
                                clearFieldError('preparationTimeMinutes');
                            }
                        }}
                        placeholder={constants.recipes.form.placeholders.preparationTime}
                        min="1"
                        className={errors.preparationTimeMinutes ? 'field-invalid' : undefined}
                        aria-invalid={Boolean(errors.preparationTimeMinutes)}
                        disabled={isSubmitting}
                    />
                    {errors.preparationTimeMinutes && (
                        <div role="alert" className="recipe-field-error">
                            {errors.preparationTimeMinutes}
                        </div>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="recipe-servings">{constants.recipes.form.labels.servings}</label>
                    <input
                        id="recipe-servings"
                        type="number"
                        value={servings}
                        onChange={(e) => {
                            setServings(e.target.value);
                            if (e.target.value.trim()) {
                                clearFieldError('servings');
                            }
                        }}
                        placeholder={constants.recipes.form.placeholders.servings}
                        min="1"
                        className={errors.servings ? 'field-invalid' : undefined}
                        aria-invalid={Boolean(errors.servings)}
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
                <label>{constants.recipes.form.labels.ingredients}</label>
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
                                placeholder={constants.recipes.form.placeholders.ingredientName}
                                className={getIngredientFieldError(index, 'name') ? 'field-invalid' : undefined}
                                aria-invalid={Boolean(getIngredientFieldError(index, 'name'))}
                                disabled={isSubmitting}
                            />
                            <input
                                type="text"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'quantity', e.target.value)
                                }
                                placeholder={constants.recipes.form.placeholders.ingredientQuantity}
                                className={getIngredientFieldError(index, 'quantity') ? 'field-invalid' : undefined}
                                aria-invalid={Boolean(getIngredientFieldError(index, 'quantity'))}
                                disabled={isSubmitting}
                            />
                            <select
                                value={ingredient.unit}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'unit', e.target.value)
                                }
                                className={getIngredientFieldError(index, 'unit') ? 'field-invalid' : undefined}
                                aria-invalid={Boolean(getIngredientFieldError(index, 'unit'))}
                                disabled={isSubmitting}
                            >
                                <option value="GRAM">{constants.recipes.form.units.GRAM}</option>
                                <option value="KG">{constants.recipes.form.units.KG}</option>
                                <option value="ML">{constants.recipes.form.units.ML}</option>
                                <option value="L">{constants.recipes.form.units.L}</option>
                                <option value="PIECE">{constants.recipes.form.units.PIECE}</option>
                                <option value="TABLESPOON">{constants.recipes.form.units.TABLESPOON}</option>
                                <option value="TEASPOON">{constants.recipes.form.units.TEASPOON}</option>
                                <option value="CUP">{constants.recipes.form.units.CUP}</option>
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
                            {(getIngredientFieldError(index, 'name') ||
                                getIngredientFieldError(index, 'quantity') ||
                                getIngredientFieldError(index, 'unit')) && (
                                <div role="alert" className="recipe-ingredient-error">
                                    {getIngredientFieldError(index, 'quantity') ||
                                        getIngredientFieldError(index, 'name') ||
                                        getIngredientFieldError(index, 'unit')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <Button type="dashed" onClick={handleAddIngredient} isDisabled={isSubmitting}>
                    {constants.recipes.form.buttons.addIngredient}
                </Button>
            </div>
            <div className="auth-field">
                <label htmlFor="recipe-description">{constants.recipes.form.labels.description}</label>
                <textarea
                    id="recipe-description"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (e.target.value.trim()) {
                            clearFieldError('description');
                        }
                    }}
                    placeholder={constants.recipes.form.placeholders.description}
                    rows={4}
                    className={errors.description ? 'field-invalid' : undefined}
                    aria-invalid={Boolean(errors.description)}
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
                    {isSubmitting
                        ? constants.recipes.form.buttons.saving
                        : initialData
                            ? constants.recipes.form.buttons.saveChanges
                            : constants.recipes.form.buttons.save}
                </Button>
            </div>
        </form>
    );
};

export default RecipeForm;
