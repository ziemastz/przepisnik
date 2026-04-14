import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../api/types';
import { AuthUser, LoginPayload, RegisterPayload, userApi } from '../../api/userApi';
import { tokenStorage } from '../../api/tokenStorage';
import constants from '../../constants';

interface AuthContextState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    errorMessage: string | null;
    serverIssueMessage: string | null;
    clearError: () => void;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const toErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError && error.messages.length > 0) {
        return error.messages[0];
    }

    if (error instanceof Error) {
        return error.message;
    }

    return constants.auth.generic.unexpectedError;
};

const isServerIssueError = (error: unknown, message: string): boolean => {
    if (!(error instanceof ApiError)) {
        return false;
    }

    if (error.status === 0 || error.status >= 500) {
        return true;
    }

    if (error.status === 401 && message.includes('konfiguracje bezpieczenstwa backendu')) {
        return true;
    }

    return false;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [serverIssueMessage, setServerIssueMessage] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setErrorMessage(null);
        setServerIssueMessage(null);
    }, []);

    useEffect(() => {
        const initialize = async () => {
            const token = tokenStorage.getToken();
            if (!token) {
                setIsInitializing(false);
                return;
            }

            try {
                const currentUser = await userApi.getCurrentUser();
                setUser(currentUser);
            } catch {
                tokenStorage.clearToken();
                setUser(null);
            } finally {
                setIsInitializing(false);
            }
        };

        void initialize();
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        clearError();
        try {
            const loggedUser = await userApi.login(payload);
            setUser(loggedUser);
        } catch (error) {
            const message = toErrorMessage(error);
            setErrorMessage(message);

            if (isServerIssueError(error, message)) {
                setServerIssueMessage(constants.auth.generic.serverIssue);
            }

            throw error;
        }
    }, [clearError]);

    const register = useCallback(async (payload: RegisterPayload) => {
        clearError();
        try {
            await userApi.register(payload);
        } catch (error) {
            const message = toErrorMessage(error);
            setErrorMessage(message);

            if (isServerIssueError(error, message)) {
                setServerIssueMessage(constants.auth.generic.serverIssue);
            }

            throw error;
        }
    }, [clearError]);

    const logout = useCallback(() => {
        userApi.logout();
        setUser(null);
        clearError();
    }, [clearError]);

    const value = useMemo<AuthContextState>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isInitializing,
            errorMessage,
            serverIssueMessage,
            clearError,
            login,
            register,
            logout,
        }),
        [clearError, errorMessage, isInitializing, login, logout, register, serverIssueMessage, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(constants.auth.generic.providerUsageError);
    }

    return context;
};
