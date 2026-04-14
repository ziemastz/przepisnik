import { ReactNode } from 'react';
import { Navigate, useLocation } from '../router';
import { useAuth } from '../features/auth/AuthContext';
import constants from '../constants';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    if (isInitializing) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>{constants.shared.sessionCheck}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={constants.routes.login} state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
