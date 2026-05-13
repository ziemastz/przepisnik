import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import AppRoutes from './AppRoutes';

jest.mock('../pages/HomePage', () => ({
    __esModule: true,
    default: () => <div>Home Page</div>,
}));

jest.mock('../features/auth/pages/LoginPage', () => ({
    __esModule: true,
    default: () => <div>Login Page</div>,
}));

jest.mock('../features/auth/pages/RegisterPage', () => ({
    __esModule: true,
    default: () => <div>Register Page</div>,
}));

jest.mock('../features/recipes/pages/MyRecipesPage', () => ({
    __esModule: true,
    default: () => <div>My Recipes Page</div>,
}));

jest.mock('../features/recipes/pages/RecipeFormPage', () => ({
    __esModule: true,
    default: () => <div>Recipe Form Page</div>,
}));

jest.mock('../pages/IngredientsPage', () => ({
    __esModule: true,
    default: () => <div>Ingredients Page</div>,
}));

jest.mock('../pages/RecipePreviewPage', () => ({
    __esModule: true,
    default: () => <div>Recipe Preview Page</div>,
}));

jest.mock('../shared/ProtectedRoute', () => ({
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

type CapturedRoute = {
    path: string;
    element: ReactNode;
};

const capturedRoutes: CapturedRoute[] = [];

jest.mock('../router', () => ({
    Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
    Route: ({ path, element }: { path: string; element: ReactNode }) => {
        capturedRoutes.push({ path, element });
        return <>{element}</>;
    },
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', state: null }),
}));

describe('AppRoutes', () => {
    beforeEach(() => {
        capturedRoutes.length = 0;
    });

    test('defines home, login, register, recipe preview, protected routes, and fallback routes', () => {
        render(<AppRoutes />);

        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.getByText('Register Page')).toBeInTheDocument();
        expect(screen.getByText('Ingredients Page')).toBeInTheDocument();
        expect(screen.getByText('Recipe Preview Page')).toBeInTheDocument();
        expect(screen.getByText('404 - Strona nie istnieje')).toBeInTheDocument();
        expect(screen.getByText('My Recipes Page')).toBeInTheDocument();
        expect(screen.getAllByText('Recipe Form Page')).toHaveLength(2); // /recipes/new and /recipes/:id/edit
        
        const paths = capturedRoutes.map((route) => route.path);
        expect(paths).toContain('/');
        expect(paths).toContain('/login');
        expect(paths).toContain('/register');
        expect(paths).toContain('/ingredients');
        expect(paths).toContain('/recipes/:id');
        expect(paths).toContain('/my-recipes');
        expect(paths).toContain('/recipes/new');
        expect(paths).toContain('/recipes/:id/edit');
        expect(paths).toContain('*');
    });
});
