import { FormEvent, useEffect, useState } from 'react';
import Button from '../../shared/button/Button';
import { useAuth } from './AuthContext';

interface RegisterFormProps {
    onSuccess: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const { register, errorMessage, serverIssueMessage, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setValidationError(null);
        clearError();
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setValidationError(null);
        clearError();
    };

    const handleNameChange = (value: string) => {
        setName(value);
        setValidationError(null);
        clearError();
    };

    const handleSurnameChange = (value: string) => {
        setSurname(value);
        setValidationError(null);
        clearError();
    };

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password.trim() || !name.trim()) {
            setValidationError('Email, haslo i imie sa wymagane.');
            return;
        }

        if (!emailRegex.test(email)) {
            setValidationError('Podaj poprawny adres email.');
            return;
        }

        if (password.length < 4) {
            setValidationError('Haslo musi miec minimum 4 znaki.');
            return;
        }

        setValidationError(null);
        setIsLoading(true);

        try {
            await register({ email, password, name, surname });
            onSuccess();
        } catch {
            // Error is handled in auth context.
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={submitForm} aria-label="register-form">
            <div className="auth-field">
                <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-password">Haslo</label>
                <input
                    id="register-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-name">Imie</label>
                <input
                    id="register-name"
                    name="given-name"
                    type="text"
                    autoComplete="given-name"
                    value={name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-surname">Nazwisko</label>
                <input
                    id="register-surname"
                    name="family-name"
                    type="text"
                    autoComplete="family-name"
                    value={surname}
                    onChange={(event) => handleSurnameChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            {validationError ? <div role="alert">{validationError}</div> : null}
            {!validationError && errorMessage ? <div role="alert">{errorMessage}</div> : null}
            {serverIssueMessage ? <div role="status" className="auth-server-issue">{serverIssueMessage}</div> : null}

            <Button type="secondary" htmlType="submit" isDisabled={isLoading}>
                {isLoading ? 'Rejestracja...' : 'Zarejestruj'}
            </Button>
        </form>
    );
};

export default RegisterForm;
