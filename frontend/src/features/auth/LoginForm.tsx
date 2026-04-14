import { FormEvent, useEffect, useState } from 'react';
import Button from '../../shared/button/Button';
import { useAuth } from './AuthContext';
import { parseBackendFieldError } from '../../shared/forms/validation';
import constants from '../../constants';

interface LoginFormProps {
    onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const { login, errorMessage, serverIssueMessage, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [invalidFields, setInvalidFields] = useState({ email: false, password: false });

    useEffect(() => {
        clearError();
    }, [clearError]);

    useEffect(() => {
        if (!errorMessage || validationError) {
            return;
        }

        const parsed = parseBackendFieldError(errorMessage);
        if (!parsed) {
            return;
        }

        const field = parsed.path[0]?.toLowerCase();
        if (field === 'email' || field === 'username') {
            setInvalidFields((current) => ({ ...current, email: true }));
        }

        if (field === 'password') {
            setInvalidFields((current) => ({ ...current, password: true }));
        }
    }, [errorMessage, validationError]);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setValidationError(null);
        setInvalidFields((current) => ({ ...current, email: false }));
        clearError();
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setValidationError(null);
        setInvalidFields((current) => ({ ...current, password: false }));
        clearError();
    };

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setValidationError(constants.auth.login.missingCredentials);
            setInvalidFields({ email: !email.trim(), password: !password.trim() });
            return;
        }

        if (password.length < 4) {
            setValidationError(constants.auth.login.shortPassword);
            setInvalidFields({ email: false, password: true });
            return;
        }

        setValidationError(null);
        setInvalidFields({ email: false, password: false });
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
                <label htmlFor="login-email">{constants.auth.login.emailLabel}</label>
                <input
                    id="login-email"
                    name="username"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    className={invalidFields.email ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.email}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="login-password">{constants.auth.login.passwordLabel}</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    className={invalidFields.password ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.password}
                    disabled={isLoading}
                />
            </div>

            {validationError ? <div role="alert">{validationError}</div> : null}
            {!validationError && errorMessage ? <div role="alert">{errorMessage}</div> : null}
            {serverIssueMessage ? <div role="status" className="auth-server-issue">{serverIssueMessage}</div> : null}

            <Button type="primary" htmlType="submit" isDisabled={isLoading}>
                {isLoading ? constants.auth.login.submitting : constants.auth.login.submit}
            </Button>
        </form>
    );
};

export default LoginForm;
