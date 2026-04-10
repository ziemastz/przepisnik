import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { userApi } from '../../api/userApi';
import { tokenStorage } from '../../api/tokenStorage';
import { ApiError } from '../../api/types';

jest.mock('../../api/userApi', () => ({
    userApi: {
        getCurrentUser: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
    },
}));

jest.mock('../../api/tokenStorage', () => ({
    tokenStorage: {
        getToken: jest.fn(),
        setToken: jest.fn(),
        clearToken: jest.fn(),
    },
}));

const mockedUserApi = userApi as jest.Mocked<typeof userApi>;
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

const mockUser = {
    username: 'jan@example.com',
    email: 'jan@example.com',
    name: 'Jan',
    surname: 'Kowalski',
    role: 'USER' as const,
};

const TestConsumer = () => {
    const {
        isAuthenticated,
        isInitializing,
        user,
        errorMessage,
        serverIssueMessage,
        login,
        register,
        logout,
        clearError,
    } = useAuth();

    return (
        <div>
            <div data-testid="is-initializing">{String(isInitializing)}</div>
            <div data-testid="is-authenticated">{String(isAuthenticated)}</div>
            <div data-testid="user">{user?.username ?? 'none'}</div>
            <div data-testid="error-message">{errorMessage ?? 'none'}</div>
            <div data-testid="server-issue">{serverIssueMessage ?? 'none'}</div>
            <button onClick={() => { void login({ email: 'jan@example.com', password: 'pass' }).catch(() => undefined) }}>
                Login
            </button>
            <button
                onClick={() => { void register({ email: 'jan@example.com', password: 'pass', name: 'Jan' }).catch(() => undefined) }}
            >
                Register
            </button>
            <button onClick={() => logout()}>Logout</button>
            <button onClick={() => clearError()}>ClearError</button>
        </div>
    );
};

const renderWithProvider = () =>
    render(
        <AuthProvider>
            <TestConsumer />
        </AuthProvider>,
    );

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('sets isInitializing=false when no token is stored', async () => {
            mockedTokenStorage.getToken.mockReturnValue(null);

            renderWithProvider();

            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });

        test('sets user when token is valid and getCurrentUser succeeds', async () => {
            mockedTokenStorage.getToken.mockReturnValue('valid-token');
            mockedUserApi.getCurrentUser.mockResolvedValue(mockUser);

            renderWithProvider();

            await waitFor(() =>
                expect(screen.getByTestId('user')).toHaveTextContent('jan@example.com'),
            );
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        });

        test('clears token and sets user=null when getCurrentUser throws', async () => {
            mockedTokenStorage.getToken.mockReturnValue('bad-token');
            mockedUserApi.getCurrentUser.mockRejectedValue(new Error('401'));

            renderWithProvider();

            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );
            expect(mockedTokenStorage.clearToken).toHaveBeenCalled();
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });
    });

    describe('login', () => {
        beforeEach(() => {
            mockedTokenStorage.getToken.mockReturnValue(null);
        });

        test('sets user on successful login', async () => {
            mockedUserApi.login.mockResolvedValue(mockUser);

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() =>
                expect(screen.getByTestId('user')).toHaveTextContent('jan@example.com'),
            );
        });

        test('sets errorMessage when login fails with generic error', async () => {
            mockedUserApi.login.mockRejectedValue(new Error('Unexpected'));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() => expect(screen.getByTestId('error-message')).toHaveTextContent('Unexpected'));
        });

        test('sets errorMessage when login fails with ApiError', async () => {
            mockedUserApi.login.mockRejectedValue(new ApiError(401, ['Nieprawidłowe hasło']));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() => expect(screen.getByTestId('error-message')).toHaveTextContent('Nieprawidłowe hasło'));
        });

        test('sets serverIssueMessage when login fails with 500 ApiError', async () => {
            mockedUserApi.login.mockRejectedValue(new ApiError(500, ['Błąd serwera']));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() => expect(screen.getByTestId('server-issue')).not.toHaveTextContent('none'));
        });

        test('sets serverIssueMessage when login fails with network error (status=0)', async () => {
            mockedUserApi.login.mockRejectedValue(new ApiError(0, ['Nie mozna polaczyc z serwerem']));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() => expect(screen.getByTestId('server-issue')).not.toHaveTextContent('none'));
        });
    });

    describe('register', () => {
        beforeEach(() => {
            mockedTokenStorage.getToken.mockReturnValue(null);
        });

        test('completes without setting errorMessage on success', async () => {
            mockedUserApi.register.mockResolvedValue({ id: 'new-user-id' });

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Register' }));

            await waitFor(() =>
                expect(screen.getByTestId('error-message')).toHaveTextContent('none'),
            );
        });

        test('sets errorMessage when register fails', async () => {
            mockedUserApi.register.mockRejectedValue(
                new ApiError(400, ['Email już zajęty']),
            );

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Register' }));

            await waitFor(() => expect(screen.getByTestId('error-message')).toHaveTextContent('Email już zajęty'));
        });

        test('sets serverIssueMessage when register fails with 500', async () => {
            mockedUserApi.register.mockRejectedValue(new ApiError(500, ['Serwer niedostepny']));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Register' }));

            await waitFor(() => expect(screen.getByTestId('server-issue')).not.toHaveTextContent('none'));
        });
    });

    describe('logout', () => {
        test('clears user and calls userApi.logout', async () => {
            mockedTokenStorage.getToken.mockReturnValue('token');
            mockedUserApi.getCurrentUser.mockResolvedValue(mockUser);

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('user')).toHaveTextContent('jan@example.com'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

            expect(mockedUserApi.logout).toHaveBeenCalled();
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });
    });

    describe('clearError', () => {
        test('clears errorMessage', async () => {
            mockedTokenStorage.getToken.mockReturnValue(null);
            mockedUserApi.login.mockRejectedValue(new Error('err'));

            renderWithProvider();
            await waitFor(() =>
                expect(screen.getByTestId('is-initializing')).toHaveTextContent('false'),
            );

            fireEvent.click(screen.getByRole('button', { name: 'Login' }));

            await waitFor(() => expect(screen.getByTestId('error-message')).not.toHaveTextContent('none'));

            fireEvent.click(screen.getByRole('button', { name: 'ClearError' }));

            await waitFor(() => expect(screen.getByTestId('error-message')).toHaveTextContent('none'));
        });
    });

    describe('useAuth outside provider', () => {
        test('throws error when used outside AuthProvider', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

            expect(() => render(<TestConsumer />)).toThrow(
                'useAuth must be used within AuthProvider.',
            );

            consoleError.mockRestore();
        });
    });
});
