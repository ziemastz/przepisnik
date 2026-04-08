import { FormEvent, useEffect, useState } from 'react';
import Button from '../../shared/button/Button';
import { useAuth } from './AuthContext';

interface LoginFormProps {
    onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const { login, errorMessage, serverIssueMessage, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setValidationError('Email i haslo sa wymagane.');
            return;
        }

        if (password.length < 4) {
            setValidationError('Haslo musi miec minimum 4 znaki.');
            return;
        }

        setValidationError(null);
        setIsLoading(true);

        try {
            await login({ email, password });
            onSuccess();
        } catch {
            // Error is handled in auth context.
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={submitForm} aria-label="login-form">
            <div className="auth-field">
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    name="username"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="login-password">Haslo</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    disabled={isLoading}
                />
            </div>

            {validationError ? <div role="alert">{validationError}</div> : null}
            {!validationError && errorMessage ? <div role="alert">{errorMessage}</div> : null}
            {serverIssueMessage ? <div role="status" className="auth-server-issue">{serverIssueMessage}</div> : null}

            <Button type="primary" htmlType="submit" isDisabled={isLoading}>
                {isLoading ? 'Logowanie...' : 'Zaloguj'}
            </Button>
        </form>
    );
};

export default LoginForm;
