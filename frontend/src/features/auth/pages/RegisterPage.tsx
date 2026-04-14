import { useState } from 'react';
import { useLocation, useNavigate } from '../../../router';
import RegisterForm from '../RegisterForm';
import Button from '../../../shared/button/Button';
import { sanitizeAuthOrigin } from '../../../shared/auth/authNavigation';
import InfoDialog from '../../../shared/dialog/InfoDialog';
import constants from '../../../constants';

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const from = sanitizeAuthOrigin((location.state as { from?: string } | null)?.from);

    const handleSuccess = () => {
        setIsSuccessDialogOpen(true);
    };

    const handleGoToLogin = () => {
        navigate(constants.routes.login, { state: { from } });
    };

    return (
        <div className="auth-page">
            <div className="auth-page-container">
                <h2>{constants.auth.register.title}</h2>
                <RegisterForm onSuccess={handleSuccess} />
                <div className="auth-switch">
                    <span>{constants.auth.register.hasAccount}</span>
                    <Button type="link" onClick={handleGoToLogin}>
                        {constants.auth.register.loginCta}
                    </Button>
                </div>
            </div>
            {isSuccessDialogOpen ? (
                <InfoDialog
                    title={constants.auth.register.successTitle}
                    message={constants.auth.register.successMessage}
                    confirmLabel={constants.auth.register.successConfirmLabel}
                    onConfirm={handleGoToLogin}
                />
            ) : null}
        </div>
    );
};

export default RegisterPage;
