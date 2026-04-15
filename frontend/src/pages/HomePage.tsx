import { useState, useEffect, useCallback, useRef } from 'react';
import { recipesApi, RecipeResponse } from '../api/recipesApi';
import constants from '../constants';

const HomePage = () => {
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const abortRef = useRef<AbortController | null>(null);

    const fetchRecipes = useCallback((query: string) => {
        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();
        setLoading(true);
        setError(null);
        recipesApi
            .getPublicRecipes(query || undefined)
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(() => {
                setError(constants.home.loadError);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchRecipes('');
    }, [fetchRecipes]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        setActiveQuery(trimmed);
        fetchRecipes(trimmed);
    };

    const handleClear = () => {
        setInputValue('');
        setActiveQuery('');
        fetchRecipes('');
    };

    const isEmpty = !loading && !error && recipes.length === 0;

    return (
        <div className="home-page">
            <div className="home-hero">
                <h1>{constants.home.title}</h1>
                <p className="home-subtitle">{constants.home.subtitle}</p>
                <form className="home-search-form" onSubmit={handleSearch} role="search">
                    <div className="home-search-input-wrapper">
                        <input
                            type="search"
                            className="home-search-input"
                            placeholder={constants.home.searchPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            aria-label={constants.home.searchPlaceholder}
                        />
                        {inputValue && (
                            <button
                                type="button"
                                className="home-search-clear"
                                onClick={handleClear}
                                aria-label={constants.home.clearButton}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button type="submit" className="button primary home-search-btn">
                        {constants.home.searchButton}
                    </button>
                </form>
            </div>

            <div className="home-recipes-section">
                {loading && (
                    <p className="home-status-text">{constants.home.loading}</p>
                )}
                {error && (
                    <p className="home-error">{error}</p>
                )}
                {isEmpty && (
                    <p className="home-status-text">
                        {activeQuery ? constants.home.emptySearch : constants.home.empty}
                    </p>
                )}
                {!loading && !error && recipes.length > 0 && (
                    <div className="recipe-list">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="recipe-card">
                                <div className="recipe-card-header">
                                    <h3>{recipe.name}</h3>
                                    <div className="recipe-card-meta">
                                        <span className="recipe-time">
                                            ⏱ {recipe.preparationTimeMinutes}{' '}
                                            {constants.recipes.list.timeSuffix}
                                        </span>
                                        <span className="recipe-servings">
                                            🍽 {recipe.servings}{' '}
                                            {constants.recipes.list.servingsSuffix}
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
                                                {ing.name} – {ing.quantity}{' '}
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
                                        <span className="recipe-author">
                                            {constants.home.authorPrefix} {recipe.author}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
