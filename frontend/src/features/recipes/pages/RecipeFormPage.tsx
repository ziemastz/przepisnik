import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../../../router';
import RecipeForm from '../components/RecipeForm';
import { recipesApi, RecipeResponse, CreateRecipeRequest } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';
import constants from '../../../constants';

const RecipeFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const [initialData, setInitialData] = useState<RecipeResponse | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(!!id);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadRecipe(id);
        }
    }, [id]);

    const loadRecipe = async (recipeId: string) => {
        try {
            setIsLoadingInitial(true);
            setLoadError(null);
            const data = await recipesApi.getRecipeById(recipeId);
            setInitialData(data);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.messages[0] ?? constants.recipes.formPage.loadError
                    : constants.recipes.formPage.loadError;
            setLoadError(message);
        } finally {
            setIsLoadingInitial(false);
        }
    };

    const handleSubmit = async (data: CreateRecipeRequest) => {
        if (id) {
            await recipesApi.updateRecipe(id, data);
        } else {
            await recipesApi.createRecipe(data);
        }

        navigate(constants.routes.myRecipes);
    };

    if (isLoadingInitial) {
        return (
            <div className="recipe-form-page">
                <div className="recipe-form-container">
                    <div className="recipe-form-loading">{constants.recipes.formPage.loading}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-form-page">
            <div className="recipe-form-container">
                <h2>{id ? constants.recipes.formPage.editTitle : constants.recipes.formPage.createTitle}</h2>
                {loadError && <div role="alert" className="recipe-form-error">{loadError}</div>}
                <RecipeForm initialData={initialData} onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default RecipeFormPage;
