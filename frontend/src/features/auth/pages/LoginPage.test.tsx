import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { useAuth } from '../AuthContext';

const mockNavigate = jest.fn();

jest.mock('../../../router', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/login', state: null }),
}));

jest.mock('../AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../LoginForm', () => ({
    __esModule: true,
    default: ({ onSuccess }: { onSuccess: () => void }) => (
        <form>
            <button type="button" onClick={onSuccess}>Mock Login</button>
        </form>
    ),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    test('renders login form', () => {
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

        render(<LoginPage />);

        expect(screen.getByRole('heading', { name: 'Zaloguj się' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Mock Login' })).toBeInTheDocument();
    });

    test('navigates to home on successful login when no origin passed', async () => {
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

        render(<LoginPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Mock Login' }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
