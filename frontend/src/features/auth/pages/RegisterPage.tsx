import { useState } from 'react';
import { useLocation, useNavigate } from '../../../router';
import RegisterForm from '../RegisterForm';
import Button from '../../../shared/button/Button';
import { sanitizeAuthOrigin } from '../../../shared/auth/authNavigation';
import InfoDialog from '../../../shared/dialog/InfoDialog';

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const from = sanitizeAuthOrigin((location.state as { from?: string } | null)?.from);

    const handleSuccess = () => {
        setIsSuccessDialogOpen(true);
    };

    const handleGoToLogin = () => {
        navigate('/login', { state: { from } });
    };

    return (
        <div className="auth-page">
            <div className="auth-page-container">
                <h2>Zarejestruj się</h2>
                <RegisterForm onSuccess={handleSuccess} />
                <div className="auth-switch">
                    <span>Masz już konto?</span>
                    <Button type="link" onClick={handleGoToLogin}>
                        Zaloguj się
                    </Button>
                </div>
            </div>
            {isSuccessDialogOpen ? (
                <InfoDialog
                    title="Konto utworzone"
                    message="Rejestracja zakończyła się sukcesem. Przejdź do logowania, aby zalogować się na nowe konto."
                    confirmLabel="Przejdź do logowania"
                    onConfirm={handleGoToLogin}
                />
            ) : null}
        </div>
    );
};

export default RegisterPage;
