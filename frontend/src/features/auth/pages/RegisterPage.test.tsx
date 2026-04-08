import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import { useAuth } from '../AuthContext';

const mockNavigate = jest.fn();

jest.mock('../../../router', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/register', state: null }),
}));

jest.mock('../AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../RegisterForm', () => ({
    __esModule: true,
    default: ({ onSuccess }: { onSuccess: () => void }) => (
        <form>
            <button type="button" onClick={onSuccess}>Mock Register</button>
        </form>
    ),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('RegisterPage', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    test('renders register form', () => {
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

        render(<RegisterPage />);

        expect(screen.getByRole('heading', { name: 'Zarejestruj się' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Mock Register' })).toBeInTheDocument();
    });

    test('opens success dialog after successful registration', async () => {
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

        render(<RegisterPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Mock Register' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        expect(screen.getByText('Rejestracja zakończyła się sukcesem. Przejdź do logowania, aby zalogować się na nowe konto.')).toBeInTheDocument();
    });

    test('navigates to login after confirming success dialog', async () => {
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

        render(<RegisterPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Mock Register' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: 'Przejdź do logowania' }));

        expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { from: '/' } });
    });
});
