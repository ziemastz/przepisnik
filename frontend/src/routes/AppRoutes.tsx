import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";

const AppRoutes = () => {
   return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/profile" element={<ProfilePage />} /> */}
            {/* Fallback dla nieznanej ścieżki */}
            <Route path="*" element={<h2>404 – Strona nie istnieje</h2>} />
        </Routes>
    );
};
export default AppRoutes;
