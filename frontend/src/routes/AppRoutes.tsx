import { Routes, Route } from '../router';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Fallback route for unknown paths */}
            <Route path="*" element={<h2>404 - Strona nie istnieje</h2>} />
        </Routes>
    );
};

export default AppRoutes;
