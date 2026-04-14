import { useLocation, useNavigate } from '../../../router';
import LoginForm from '../LoginForm';
import Button from '../../../shared/button/Button';
import { sanitizeAuthOrigin } from '../../../shared/auth/authNavigation';
import constants from '../../../constants';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = sanitizeAuthOrigin((location.state as { from?: string } | null)?.from);

    const handleSuccess = () => {
        navigate(from);
    };

    const handleGoToRegister = () => {
        navigate(constants.routes.register, { state: { from } });
    };

    return (
        <div className="auth-page">
            <div className="auth-page-container">
                <h2>{constants.auth.login.title}</h2>
                <LoginForm onSuccess={handleSuccess} />
                <div className="auth-switch">
                    <span>{constants.auth.login.noAccount}</span>
                    <Button type="link" onClick={handleGoToRegister}>
                        {constants.auth.login.registerCta}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
