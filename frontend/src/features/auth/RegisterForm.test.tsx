import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { useAuth } from './AuthContext';

jest.mock('./AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('RegisterForm', () => {
    test('validates required fields', () => {
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

        render(<RegisterForm onSuccess={jest.fn()} />);

        fireEvent.submit(screen.getByRole('form', { name: 'register-form' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Email, haslo i imie sa wymagane.');
    });

    test('validates email format and password length', () => {
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

        render(<RegisterForm onSuccess={jest.fn()} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByLabelText('Haslo'), { target: { value: '123' } });
        fireEvent.change(screen.getByLabelText('Imie'), { target: { value: 'Jan' } });
        fireEvent.submit(screen.getByRole('form', { name: 'register-form' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Podaj poprawny adres email.');
    });

    test('submits register payload', async () => {
        const register = jest.fn().mockResolvedValue(undefined);
        const onSuccess = jest.fn();

        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: null,
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register,
            logout: jest.fn(),
        });

        render(<RegisterForm onSuccess={onSuccess} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText('Haslo'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('Imie'), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText('Nazwisko'), { target: { value: 'Kowalski' } });

        fireEvent.submit(screen.getByRole('form', { name: 'register-form' }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                email: 'jan@example.com',
                password: '1234',
                name: 'Jan',
                surname: 'Kowalski',
            });
        });

        expect(onSuccess).toHaveBeenCalled();
    });

    test('renders api error from auth context', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            errorMessage: 'Uzytkownik z e-mailem juz istnieje.',
            serverIssueMessage: null,
            clearError: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        render(<RegisterForm onSuccess={jest.fn()} />);

        expect(screen.getByRole('alert')).toHaveTextContent('Uzytkownik z e-mailem juz istnieje.');
    });
});
