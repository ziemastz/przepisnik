import { useState, useEffect } from 'react';
import { ingredientsApi } from '../../api/ingredientsApi';
import constants from '../../constants';

interface IngredientDialogProps {
    ingredientId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

const IngredientDialog = ({ ingredientId, onClose, onSave }: IngredientDialogProps) => {
    const [name, setName] = useState('');
    const [protein, setProtein] = useState<string>('');
    const [fat, setFat] = useState<string>('');
    const [carbohydrates, setCarbohydrates] = useState<string>('');
    const [loading, setLoading] = useState(ingredientId ? true : false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    useEffect(() => {
        if (ingredientId) {
            loadIngredient(ingredientId);
        }
    }, [ingredientId]);

    const loadIngredient = async (id: string) => {
        try {
            setLoading(true);
            const ingredient = await ingredientsApi.getIngredientById(id);
            setName(ingredient.name);
            setProtein(ingredient.protein?.toString() || '');
            setFat(ingredient.fat?.toString() || '');
            setCarbohydrates(ingredient.carbohydrates?.toString() || '');
            setLoading(false);
        } catch (err) {
            setGeneralError('Nie udało się załadować składnika.');
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const isValidOptionalNumber = (value: string) => {
            if (!value) {
                return true;
            }

            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                return false;
            }

            const parsed = parseFloat(value);
            return parsed >= 0 && parsed <= 9999.99;
        };

        if (!name.trim()) {
            newErrors.name = constants.ingredients.form.errors.nameRequired;
        }

        // Validate that at least one BTW field is provided (or all are optional)
        // Since BTW is optional, we just validate the format if provided
        if (!isValidOptionalNumber(protein)) {
            newErrors.protein = constants.ingredients.form.errors.proteinInvalid;
        }
        if (!isValidOptionalNumber(fat)) {
            newErrors.fat = constants.ingredients.form.errors.fatInvalid;
        }
        if (!isValidOptionalNumber(carbohydrates)) {
            newErrors.carbohydrates = constants.ingredients.form.errors.carbohydratesInvalid;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const proteinVal = protein ? parseFloat(protein) : null;
            const fatVal = fat ? parseFloat(fat) : null;
            const carbsVal = carbohydrates ? parseFloat(carbohydrates) : null;

            if (ingredientId) {
                await ingredientsApi.updateIngredient(ingredientId, {
                    name: name.trim(),
                    protein: proteinVal,
                    fat: fatVal,
                    carbohydrates: carbsVal,
                });
            } else {
                await ingredientsApi.createIngredient({
                    name: name.trim(),
                    protein: proteinVal,
                    fat: fatVal,
                    carbohydrates: carbsVal,
                });
            }

            onSave();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '';
            if (message.includes('już istnieje')) {
                setGeneralError(constants.ingredients.form.errors.alreadyExists);
            } else {
                setGeneralError(constants.ingredients.form.errors.submitFallback);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                    <p>{constants.ingredients.list.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">
                    {ingredientId
                        ? constants.ingredients.form.editTitle
                        : constants.ingredients.form.title}
                </h2>

                {generalError && <p className="form-error">{generalError}</p>}

                <form onSubmit={handleSubmit} className="ingredient-form">
                    <div className="form-group">
                        <label htmlFor="ingredient-name">
                            {constants.ingredients.form.labels.name}
                        </label>
                        <input
                            id="ingredient-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={constants.ingredients.form.placeholders.name}
                            className={errors.name ? 'field-invalid' : ''}
                            aria-invalid={Boolean(errors.name)}
                            disabled={saving}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ingredient-protein">
                                {constants.ingredients.form.labels.protein}
                            </label>
                            <input
                                id="ingredient-protein"
                                type="number"
                                step="0.01"
                                min="0"
                                max="9999.99"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                placeholder={constants.ingredients.form.placeholders.protein}
                                className={errors.protein ? 'field-invalid' : ''}
                                aria-invalid={Boolean(errors.protein)}
                                disabled={saving}
                            />
                            {errors.protein && <span className="field-error">{errors.protein}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="ingredient-fat">
                                {constants.ingredients.form.labels.fat}
                            </label>
                            <input
                                id="ingredient-fat"
                                type="number"
                                step="0.01"
                                min="0"
                                max="9999.99"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                                placeholder={constants.ingredients.form.placeholders.fat}
                                className={errors.fat ? 'field-invalid' : ''}
                                aria-invalid={Boolean(errors.fat)}
                                disabled={saving}
                            />
                            {errors.fat && <span className="field-error">{errors.fat}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="ingredient-carbs">
                                {constants.ingredients.form.labels.carbohydrates}
                            </label>
                            <input
                                id="ingredient-carbs"
                                type="number"
                                step="0.01"
                                min="0"
                                max="9999.99"
                                value={carbohydrates}
                                onChange={(e) => setCarbohydrates(e.target.value)}
                                placeholder={constants.ingredients.form.placeholders.carbohydrates}
                                className={errors.carbohydrates ? 'field-invalid' : ''}
                                aria-invalid={Boolean(errors.carbohydrates)}
                                disabled={saving}
                            />
                            {errors.carbohydrates && (
                                <span className="field-error">{errors.carbohydrates}</span>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="button secondary"
                            onClick={onClose}
                            disabled={saving}
                        >
                            {constants.ingredients.form.buttons.cancel}
                        </button>
                        <button
                            type="submit"
                            className="button primary"
                            disabled={saving}
                        >
                            {saving
                                ? constants.ingredients.form.buttons.saving
                                : constants.ingredients.form.buttons.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IngredientDialog;
