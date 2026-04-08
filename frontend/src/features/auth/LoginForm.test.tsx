import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useAuth } from './AuthContext';

jest.mock('./AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginForm', () => {
    test('validates required fields', async () => {
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

        render(<LoginForm onSuccess={jest.fn()} />);

        fireEvent.submit(screen.getByRole('form', { name: 'login-form' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Email i haslo sa wymagane.');
    });

    test('validates minimal password length', async () => {
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

        render(<LoginForm onSuccess={jest.fn()} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Haslo'), { target: { value: '123' } });
        fireEvent.submit(screen.getByRole('form', { name: 'login-form' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Haslo musi miec minimum 4 znaki.');
    });

    test('submits credentials and calls onSuccess', async () => {
        const login = jest.fn().mockResolvedValue(undefined);
        const onSuccess = jest.fn();

        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: null,
            serverIssueMessage: null,
            clearError: jest.fn(),
            login,
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<LoginForm onSuccess={onSuccess} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Haslo'), { target: { value: '1234' } });
        fireEvent.submit(screen.getByRole('form', { name: 'login-form' }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'john@example.com', password: '1234' });
        });
        expect(onSuccess).toHaveBeenCalled();
    });

    test('renders api error from auth context', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: 'Invalid username or password.',
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<LoginForm onSuccess={jest.fn()} />);

        expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password.');
    });

    test('renders generic server issue info from auth context', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: 'Nie udalo sie wykonac zadania. Sprobuj ponownie.',
            serverIssueMessage: 'Wykryto problem z serwerem. Sprawdz polaczenie z backendem i sprobuj ponownie.',
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<LoginForm onSuccess={jest.fn()} />);

        expect(screen.getByRole('status')).toHaveTextContent(
            'Wykryto problem z serwerem. Sprawdz polaczenie z backendem i sprobuj ponownie.',
        );
    });
});
