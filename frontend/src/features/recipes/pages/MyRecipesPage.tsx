import { useState, useEffect } from 'react';
import { useNavigate } from '../../../router';
import { recipesApi, RecipeResponse } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import RecipeList from '../components/RecipeList';
import Button from '../../../shared/button/Button';
import InfoDialog from '../../../shared/dialog/InfoDialog';
import constants from '../../../constants';

const MyRecipesPage = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const recipePendingDeletion = deleteConfirmId
        ? (recipes.find((recipe) => recipe.id === deleteConfirmId) ?? null)
        : null;

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
                    ? (err.messages[0] ?? constants.recipes.list.loadError)
                    : constants.recipes.list.loadError;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/recipes/${id}/edit`);
    };

    const handleDeleteClick = (id: string) => {
        setError(null);
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;

        try {
            setIsDeleting(true);
            setError(null);
            await recipesApi.deleteRecipe(deleteConfirmId);
            setRecipes((currentRecipes) =>
                currentRecipes.filter((recipe) => recipe.id !== deleteConfirmId),
            );
            setDeleteConfirmId(null);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? (err.messages[0] ?? constants.recipes.list.deleteError)
                    : constants.recipes.list.deleteError;
            setError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddRecipe = () => {
        navigate(constants.routes.recipeNew);
    };

    return (
        <div className="recipes-page">
            <div className="recipes-page-container">
                <div className="recipes-header">
                    <h2>{constants.recipes.list.title}</h2>
                    <Button type="primary" onClick={handleAddRecipe}>
                        {constants.recipes.list.addButton}
                    </Button>
                </div>

                {error && (
                    <div role="alert" className="recipes-error">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="recipes-loading">{constants.recipes.list.loading}</div>
                ) : recipes.length === 0 ? (
                    <div className="recipes-empty">
                        <p>{constants.recipes.list.empty}</p>
                        <Button type="primary" onClick={handleAddRecipe}>
                            {constants.recipes.list.addFirstButton}
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
                        title={constants.recipes.list.deleteDialogTitle}
                        message={
                            recipePendingDeletion
                                ? constants.recipes.list.deleteDialogMessageWithName.replace('{name}', recipePendingDeletion.name)
                                : constants.recipes.list.deleteDialogMessageGeneric
                        }
                        confirmLabel={isDeleting ? constants.recipes.list.deleting : constants.recipes.list.deleteConfirm}
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
