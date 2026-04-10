import { useState, useEffect } from 'react';
import { useNavigate } from '../../../router';
import { recipesApi, RecipeResponse } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import RecipeList from '../components/RecipeList';
import Button from '../../../shared/button/Button';
import InfoDialog from '../../../shared/dialog/InfoDialog';

const MyRecipesPage = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await recipesApi.getMyRecipes();
            setRecipes(data);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.messages[0] ?? 'Nie udało się załadować przepisów.'
                    : 'Nie udało się załadować przepisów.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/recipes/${id}/edit`);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;

        try {
            setIsDeleting(true);
            await recipesApi.deleteRecipe(deleteConfirmId);
            setRecipes(recipes.filter((r) => r.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.messages[0] ?? 'Nie udało się usunąć przepisu.'
                    : 'Nie udało się usunąć przepisu.';
            setError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddRecipe = () => {
        navigate('/recipes/new');
    };

    return (
        <div className="recipes-page">
            <div className="recipes-page-container">
                <div className="recipes-header">
                    <h2>Moje przepisy</h2>
                    <Button type="primary" onClick={handleAddRecipe}>
                        + Dodaj przepis
                    </Button>
                </div>

                {error && <div role="alert" className="recipes-error">{error}</div>}

                {isLoading ? (
                    <div className="recipes-loading">Ładowanie...</div>
                ) : recipes.length === 0 ? (
                    <div className="recipes-empty">
                        <p>Nie masz jeszcze żadnych przepisów.</p>
                        <Button type="primary" onClick={handleAddRecipe}>
                            Dodaj pierwszy przepis
                        </Button>
                    </div>
                ) : (
                    <RecipeList
                        recipes={recipes}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}

                {deleteConfirmId ? (
                    <InfoDialog
                        title="Usunąć przepis?"
                        message="Ta operacja nie może być cofnięta."
                        confirmLabel={isDeleting ? 'Usuwanie...' : 'Usuń'}
                        onConfirm={handleConfirmDelete}
                        isLoading={isDeleting}
                        onCancel={() => setDeleteConfirmId(null)}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default MyRecipesPage;
