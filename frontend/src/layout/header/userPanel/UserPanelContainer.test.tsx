import { fireEvent, render, screen } from '@testing-library/react';
import UserPanelContainer from './UserPanelContainer';
import { useAuth } from '../../../features/auth/AuthContext';

jest.mock('../../../router', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', state: null }),
}));

jest.mock('../../../features/auth/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('UserPanelContainer', () => {
    test('shows login/register buttons when user is logged out', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: null,
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<UserPanelContainer />);

        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    test('shows user data and logout action when authenticated', () => {
        const logout = jest.fn();
        mockedUseAuth.mockReturnValue({
            user: {
                username: 'john@example.com',
                email: 'john@example.com',
                name: 'John',
                surname: 'Doe',
                role: 'USER',
            },
            isAuthenticated: true,
            isInitializing: false,
            errorMessage: null,
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout,
        });

        render(<UserPanelContainer />);

        expect(screen.getByText('Witaj, John!')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Wyloguj' }));
        expect(logout).toHaveBeenCalledTimes(1);
    });

    test('shows loading state while session initializes', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: true,
            errorMessage: null,
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<UserPanelContainer />);

        expect(screen.getByText('Sprawdzanie sesji...')).toBeInTheDocument();
    });
});
