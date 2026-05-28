import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from '../router';
import { recipesApi, RecipeResponse } from '../api/recipesApi';
import { uppercaseFirstCharacter, formatMacro } from '../shared/utils/text';
import constants from '../constants';

const RecipePreviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        if (!id) {
            setLoading(false);
            setError(constants.recipes.preview.loadError);
            return;
        }

        const loadRecipe = async () => {
            setLoading(true);
            setError(null);

            try {
                const recipeResponse = await recipesApi.getPublicRecipeById(id);
                if (!isMounted) {
                    return;
                }

                setRecipe(recipeResponse);
            } catch {
                if (!isMounted) {
                    return;
                }
                setError(constants.recipes.preview.loadError);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadRecipe();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const createdDate = useMemo(() => {
        if (!recipe) {
            return '';
        }

        return new Date(recipe.createdAt).toLocaleDateString(constants.recipes.list.dateLocale);
    }, [recipe]);

    if (loading) {
        return (
            <div className="recipe-preview-page">
                <p className="home-status-text">{constants.recipes.preview.loading}</p>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-preview-page">
                <p className="home-error">{error ?? constants.recipes.preview.loadError}</p>
                <div className="recipe-preview-back-wrapper">
                    <Link to={constants.routes.home} className="button secondary">
                        {constants.recipes.preview.backToHome}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-preview-page">
            <section className="recipe-preview-hero">
                <div className="recipe-preview-header">
                    <h1>{uppercaseFirstCharacter(recipe.name)}</h1>
                    <div className="recipe-preview-meta">
                        <span>
                            ⏱ {recipe.preparationTimeMinutes} {constants.recipes.list.timeSuffix}
                        </span>
                        <span>
                            🍽 {recipe.servings} {constants.recipes.list.servingsSuffix}
                        </span>
                        <span className="recipe-ingredient-btw">
                            🧾 {constants.recipes.preview.formatBTW(
                                formatMacro(recipe.nutritionalValues.protein),
                                formatMacro(recipe.nutritionalValues.fat),
                                formatMacro(recipe.nutritionalValues.carbohydrates),
                            )}
                        </span>
                        <span>
                            {constants.home.authorPrefix} {recipe.author}
                        </span>
                        <span>
                            {constants.recipes.list.createdPrefix} {createdDate}
                        </span>
                    </div>
                </div>
            </section>

            <section className="recipe-preview-content">
                <article className="recipe-preview-card">
                    <h2>{constants.recipes.preview.ingredientsHeading}</h2>
                    <ul className="recipe-preview-ingredients">
                        {recipe.ingredients.map((ingredient, index) => {
                            return (
                                <li
                                    key={`${ingredient.name}-${index}`}
                                    className="recipe-preview-ingredient-item"
                                >
                                    <div className="recipe-preview-ingredient-main">
                                        <span className="recipe-preview-ingredient-name">
                                            {uppercaseFirstCharacter(ingredient.name)}
                                        </span>
                                        <span>
                                            {ingredient.quantity}{' '}
                                            {constants.recipes.form.units[ingredient.unit]}
                                        </span>
                                    </div>
                                    <span className="recipe-preview-ingredient-btw">
                                        {constants.recipes.preview.formatBTW(
                                            formatMacro(ingredient.nutritionalValues.protein),
                                            formatMacro(ingredient.nutritionalValues.fat),
                                            formatMacro(ingredient.nutritionalValues.carbohydrates),
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </article>

                <article className="recipe-preview-card recipe-preview-description">
                    <h2>{constants.recipes.preview.preparationHeading}</h2>
                    <p>{recipe.description}</p>
                </article>
            </section>

            <div className="recipe-preview-back-wrapper">
                <Link to={constants.routes.home} className="button secondary">
                    {constants.recipes.preview.backToHome}
                </Link>
            </div>
        </div>
    );
};

export default RecipePreviewPage;
