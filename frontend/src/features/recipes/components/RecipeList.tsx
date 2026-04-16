import { RecipeResponse } from '../../../api/recipesApi';
import Button from '../../../shared/button/Button';
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
                        <h3>{recipe.name}</h3>
                        <div className="recipe-card-meta">
                            <span className="recipe-time">⏱ {recipe.preparationTimeMinutes} {constants.recipes.list.timeSuffix}</span>
                            <span className="recipe-servings">🍽 {recipe.servings} {constants.recipes.list.servingsSuffix}</span>
                        </div>
                    </div>
                    <div className="recipe-card-body">
                        <p className="recipe-ingredients-label">{constants.recipes.list.ingredientsLabel}</p>
                        <ul className="recipe-ingredients">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>
                                    {ing.name} - {ing.quantity} {constants.recipes.form.units[ing.unit]}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-card-footer">
                        <div className="recipe-timestamps">
                            <span className="recipe-created">
                                {constants.recipes.list.createdPrefix} {new Date(recipe.createdAt).toLocaleDateString(constants.recipes.list.dateLocale)}
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
