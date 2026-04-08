import { Routes, Route } from '../router';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../shared/ProtectedRoute';
import MyRecipesPage from '../features/recipes/pages/MyRecipesPage';
import RecipeFormPage from '../features/recipes/pages/RecipeFormPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/my-recipes"
                element={
                    <ProtectedRoute>
                        <MyRecipesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes/new"
                element={
                    <ProtectedRoute>
                        <RecipeFormPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes/:id/edit"
                element={
                    <ProtectedRoute>
                        <RecipeFormPage />
                    </ProtectedRoute>
                }
            />
            {/* Fallback route for unknown paths */}
            <Route path="*" element={<h2>404 - Strona nie istnieje</h2>} />
        </Routes>
    );
};

export default AppRoutes;
