import { Routes, Route } from '../router';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../shared/ProtectedRoute';
import MyRecipesPage from '../features/recipes/pages/MyRecipesPage';
import RecipeFormPage from '../features/recipes/pages/RecipeFormPage';
import IngredientsPage from '../pages/IngredientsPage';
import RecipePreviewPage from '../pages/RecipePreviewPage';
import constants from '../constants';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={constants.routes.home} element={<HomePage />} />
            <Route path={constants.routes.login} element={<LoginPage />} />
            <Route path={constants.routes.register} element={<RegisterPage />} />
            <Route path={constants.routes.ingredients} element={<IngredientsPage />} />
            <Route path={constants.routes.recipeDetails} element={<RecipePreviewPage />} />
            <Route
                path={constants.routes.myRecipes}
                element={
                    <ProtectedRoute>
                        <MyRecipesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={constants.routes.recipeNew}
                element={
                    <ProtectedRoute>
                        <RecipeFormPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={constants.routes.recipeEdit}
                element={
                    <ProtectedRoute>
                        <RecipeFormPage />
                    </ProtectedRoute>
                }
            />
            {/* Fallback route for unknown paths */}
            <Route path="*" element={<h2>{constants.routes.notFoundText}</h2>} />
        </Routes>
    );
};

export default AppRoutes;
