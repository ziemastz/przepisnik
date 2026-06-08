import { RecipeResponse } from '../../../api/recipesApi';
import Button from '../../../shared/button/Button';
import { uppercaseFirstCharacter, formatMacro, formatPercent, colorForZoRating } from '../../../shared/utils/text';
import constants from '../../../constants';

interface RecipeListProps {
    recipes: RecipeResponse[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const RecipeList = ({ recipes, onEdit, onDelete }: RecipeListProps) => {
    return (
        <div className="recipe-list">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                    <div className="recipe-card-header">
                        <h3>{uppercaseFirstCharacter(recipe.name)}</h3>
                        <div className="recipe-card-meta">
                            <span className="recipe-time">
                                ⏱ {recipe.preparationTimeMinutes}{' '}
                                {constants.recipes.list.timeSuffix}
                            </span>
                            <span className="recipe-servings">
                                🍽 {recipe.servings} {constants.recipes.list.servingsSuffix}
                            </span>
                            <span className="recipe-ingredient-btw">
                               🧾 {constants.recipes.preview.formatBTW(
                                    formatMacro(recipe.nutritionalValues.protein),
                                    formatMacro(recipe.nutritionalValues.fat),
                                    formatMacro(recipe.nutritionalValues.carbohydrates),
                                )}
                            </span>
                            <span
                                className="recipe-zo-badge"
                            >
                                <span
                                    className={`recipe-zo-value ${colorForZoRating(recipe.zoRating)}`}
                                >
                                    {constants.recipes.preview.zoPrefix}:{' '}
                                    {formatPercent(recipe.zo)}%
                                </span>
                                <span className="recipe-zo-tooltip-content">
                                    {constants.recipes.preview.zoTooltipText}{' '}
                                    <a href={constants.routes.optimalNutrition}>
                                        {constants.recipes.preview.zoTooltipLinkLabel}
                                    </a>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="recipe-card-body">
                        <p className="recipe-ingredients-label">
                            {constants.recipes.list.ingredientsLabel}
                        </p>
                        <ul className="recipe-ingredients">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>
                                    {uppercaseFirstCharacter(ing.name)} - {ing.quantity}{' '}
                                    {constants.recipes.form.units[ing.unit]}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-card-footer">
                        <div className="recipe-timestamps">
                            <span className="recipe-created">
                                {constants.recipes.list.createdPrefix}{' '}
                                {new Date(recipe.createdAt).toLocaleDateString(
                                    constants.recipes.list.dateLocale,
                                )}
                            </span>
                        </div>
                        <div className="recipe-actions">
                            <Button type="primary" onClick={() => onEdit(recipe.id)}>
                                {constants.recipes.list.editButton}
                            </Button>
                            <Button type="secondary" onClick={() => onDelete(recipe.id)}>
                                {constants.recipes.list.deleteButton}
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
