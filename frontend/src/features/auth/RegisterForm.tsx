import { FormEvent, useEffect, useState } from 'react';
import Button from '../../shared/button/Button';
import { useAuth } from './AuthContext';
import { parseBackendFieldError } from '../../shared/forms/validation';
import constants from '../../constants';

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
    const [invalidFields, setInvalidFields] = useState({
        email: false,
        password: false,
        name: false,
        surname: false,
    });

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

        if (field === 'name') {
            setInvalidFields((current) => ({ ...current, name: true }));
        }

        if (field === 'surname') {
            setInvalidFields((current) => ({ ...current, surname: true }));
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

    const handleNameChange = (value: string) => {
        setName(value);
        setValidationError(null);
        setInvalidFields((current) => ({ ...current, name: false }));
        clearError();
    };

    const handleSurnameChange = (value: string) => {
        setSurname(value);
        setValidationError(null);
        setInvalidFields((current) => ({ ...current, surname: false }));
        clearError();
    };

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password.trim() || !name.trim()) {
            setValidationError(constants.auth.register.missingRequired);
            setInvalidFields({
                email: !email.trim(),
                password: !password.trim(),
                name: !name.trim(),
                surname: false,
            });
            return;
        }

        if (!emailRegex.test(email)) {
            setValidationError(constants.auth.register.invalidEmail);
            setInvalidFields({ email: true, password: false, name: false, surname: false });
            return;
        }

        if (password.length < 4) {
            setValidationError(constants.auth.register.shortPassword);
            setInvalidFields({ email: false, password: true, name: false, surname: false });
            return;
        }

        setValidationError(null);
        setInvalidFields({ email: false, password: false, name: false, surname: false });
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
                <label htmlFor="register-email">{constants.auth.register.emailLabel}</label>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    className={invalidFields.email ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.email}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-password">{constants.auth.register.passwordLabel}</label>
                <input
                    id="register-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    className={invalidFields.password ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.password}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-name">{constants.auth.register.nameLabel}</label>
                <input
                    id="register-name"
                    name="given-name"
                    type="text"
                    autoComplete="given-name"
                    value={name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className={invalidFields.name ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.name}
                    disabled={isLoading}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="register-surname">{constants.auth.register.surnameLabel}</label>
                <input
                    id="register-surname"
                    name="family-name"
                    type="text"
                    autoComplete="family-name"
                    value={surname}
                    onChange={(event) => handleSurnameChange(event.target.value)}
                    className={invalidFields.surname ? 'field-invalid' : undefined}
                    aria-invalid={invalidFields.surname}
                    disabled={isLoading}
                />
            </div>

            {validationError ? <div role="alert">{validationError}</div> : null}
            {!validationError && errorMessage ? <div role="alert">{errorMessage}</div> : null}
            {serverIssueMessage ? <div role="status" className="auth-server-issue">{serverIssueMessage}</div> : null}

            <Button type="secondary" htmlType="submit" isDisabled={isLoading}>
                {isLoading ? constants.auth.register.submitting : constants.auth.register.submit}
            </Button>
        </form>
    );
};

export default RegisterForm;
