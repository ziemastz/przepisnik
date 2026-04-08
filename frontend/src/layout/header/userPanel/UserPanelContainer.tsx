import { useNavigate, useLocation } from '../../../router';
import Button from '../../../shared/button/Button';
import UserMenu from './UserMenu';
import { useAuth } from '../../../features/auth/AuthContext';
import { resolveAuthOriginForNavigation } from '../../../shared/auth/authNavigation';

const UserPanelContainer = () => {
    const { isAuthenticated, user, logout, isInitializing } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isInitializing) {
        return <div className="login-container">Sprawdzanie sesji...</div>;
    }

    if (isAuthenticated && user) {
        return (
            <div className="login-container">
                <div className="login-item login-item--user-row">
                    <span>Witaj, {user.name || user.username}!</span>
                    <UserMenu onLogout={logout} />
                </div>
            </div>
        );
    }

    const handleLoginClick = () => {
        const from = resolveAuthOriginForNavigation(location.pathname, location.state as { from?: string } | null);
        navigate('/login', { state: { from } });
    };

    const handleRegisterClick = () => {
        const from = resolveAuthOriginForNavigation(location.pathname, location.state as { from?: string } | null);
        navigate('/register', { state: { from } });
    };

    return (
        <div className="login-container">
            <div className="auth-actions">
                <Button type="primary" onClick={handleLoginClick}>
                    Log In
                </Button>
                <Button type="secondary" onClick={handleRegisterClick}>
                    Register
                </Button>
            </div>
        </div>
    );
};

export default UserPanelContainer;
