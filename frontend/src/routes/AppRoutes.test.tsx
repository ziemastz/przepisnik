import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import AppRoutes from './AppRoutes';

jest.mock('../features/auth/pages/LoginPage', () => ({
    __esModule: true,
    default: () => <div>Login Page</div>,
}));

jest.mock('../features/auth/pages/RegisterPage', () => ({
    __esModule: true,
    default: () => <div>Register Page</div>,
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

    test('defines home, login, register, and fallback routes', () => {
        render(<AppRoutes />);

        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.getByText('Register Page')).toBeInTheDocument();
        expect(screen.getByText('404 - Strona nie istnieje')).toBeInTheDocument();
        expect(capturedRoutes.map((route) => route.path)).toEqual(['/', '/login', '/register', '*']);
    });
});
