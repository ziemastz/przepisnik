import { RecipeResponse } from '../../../api/recipesApi';
import Button from '../../../shared/button/Button';

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
                            <span className="recipe-time">⏱ {recipe.preparationTimeMinutes} min</span>
                            <span className="recipe-servings">🍽 {recipe.servings} porcji</span>
                        </div>
                    </div>
                    <div className="recipe-card-body">
                        <p className="recipe-ingredients-label">Składniki:</p>
                        <ul className="recipe-ingredients">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>
                                    {ing.name} - {ing.quantity} {ing.unit}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-card-footer">
                        <div className="recipe-timestamps">
                            <span className="recipe-created">
                                Utworzony: {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
                            </span>
                        </div>
                        <div className="recipe-actions">
                            <Button type="primary" onClick={() => onEdit(recipe.id)}>
                                Edytuj
                            </Button>
                            <Button type="secondary" onClick={() => onDelete(recipe.id)}>
                                Usuń
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
