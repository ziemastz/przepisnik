import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../../../router';
import RecipeForm from '../components/RecipeForm';
import { recipesApi, RecipeResponse, CreateRecipeRequest } from '../../../api/recipesApi';
import { ApiError } from '../../../api/types';

const RecipeFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const [initialData, setInitialData] = useState<RecipeResponse | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadRecipe(id);
        }
    }, [id]);

    const loadRecipe = async (recipeId: string) => {
        try {
            setIsLoadingInitial(true);
            setError(null);
            const data = await recipesApi.getRecipeById(recipeId);
            setInitialData(data);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.messages[0] ?? 'Nie udało się załadować przepisu.'
                    : 'Nie udało się załadować przepisu.';
            setError(message);
        } finally {
            setIsLoadingInitial(false);
        }
    };

    const handleSubmit = async (data: CreateRecipeRequest) => {
        try {
            if (id) {
                await recipesApi.updateRecipe(id, data);
            } else {
                await recipesApi.createRecipe(data);
            }
            navigate('/my-recipes');
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.messages[0] ?? 'Nie udało się zapisać przepisu.'
                    : 'Nie udało się zapisać przepisu.';
            setError(message);
        }
    };

    if (isLoadingInitial) {
        return (
            <div className="recipe-form-page">
                <div className="recipe-form-container">
                    <div className="recipe-form-loading">Ładowanie...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-form-page">
            <div className="recipe-form-container">
                <h2>{id ? 'Edytuj przepis' : 'Dodaj nowy przepis'}</h2>
                {error && <div role="alert" className="recipe-form-error">{error}</div>}
                <RecipeForm initialData={initialData} onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default RecipeFormPage;
