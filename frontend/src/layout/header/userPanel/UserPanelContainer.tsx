import { useNavigate, useLocation } from '../../../router';
import Button from '../../../shared/button/Button';
import UserMenu from './UserMenu';
import { useAuth } from '../../../features/auth/AuthContext';
import { resolveAuthOriginForNavigation } from '../../../shared/auth/authNavigation';
import constants from '../../../constants';

const UserPanelContainer = () => {
    const { isAuthenticated, user, logout, isInitializing } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isInitializing) {
        return <div className="login-container">{constants.shared.sessionCheck}</div>;
    }

    if (isAuthenticated && user) {
        return (
            <div className="login-container">
                <div className="login-item login-item--user-row">
                    <span>{constants.layout.header.welcomePrefix} {user.name || user.username}!</span>
                    <UserMenu onLogout={logout} />
                </div>
            </div>
        );
    }

    const handleLoginClick = () => {
        const from = resolveAuthOriginForNavigation(location.pathname, location.state as { from?: string } | null);
        navigate(constants.routes.login, { state: { from } });
    };

    const handleRegisterClick = () => {
        const from = resolveAuthOriginForNavigation(location.pathname, location.state as { from?: string } | null);
        navigate(constants.routes.register, { state: { from } });
    };

    return (
        <div className="login-container">
            <div className="auth-actions">
                <Button type="primary" onClick={handleLoginClick}>
                    {constants.layout.header.login}
                </Button>
                <Button type="secondary" onClick={handleRegisterClick}>
                    {constants.layout.header.register}
                </Button>
            </div>
        </div>
    );
};

export default UserPanelContainer;
