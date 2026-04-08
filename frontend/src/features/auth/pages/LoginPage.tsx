import { useLocation, useNavigate } from '../../../router';
import LoginForm from '../LoginForm';
import Button from '../../../shared/button/Button';
import { sanitizeAuthOrigin } from '../../../shared/auth/authNavigation';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = sanitizeAuthOrigin((location.state as { from?: string } | null)?.from);

    const handleSuccess = () => {
        navigate(from);
    };

    const handleGoToRegister = () => {
        navigate('/register', { state: { from } });
    };

    return (
        <div className="auth-page">
            <div className="auth-page-container">
                <h2>Zaloguj się</h2>
                <LoginForm onSuccess={handleSuccess} />
                <div className="auth-switch">
                    <span>Nie masz konta?</span>
                    <Button type="link" onClick={handleGoToRegister}>
                        Zarejestruj się
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
