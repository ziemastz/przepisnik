import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
    surname?: string;
}

interface LoginResponse {
    token: string;
    type: string;
}

interface RegisterResponse {
    id: string;
}

interface CurrentUserResponse {
    username: string;
    email: string;
    name: string;
    surname: string;
    role: string;
}

export interface AuthUser {
    username: string;
    email: string;
    name: string;
    surname: string;
    role: string;
}

const normalizeUser = (user: CurrentUserResponse): AuthUser => ({
    username: user.username,
    email: user.email,
    name: user.name,
    surname: user.surname,
    role: user.role,
});

export const userApi = {
    async login(payload: LoginPayload): Promise<AuthUser> {
        const loginResult = await apiClient.post<LoginResponse, { data: { username: string; password: string } }>(
            '/api/auth/login',
            {
                data: {
                    username: payload.email,
                    password: payload.password,
                },
            },
            false,
        );

        tokenStorage.setToken(loginResult.token);
        return this.getCurrentUser();
    },

    async register(payload: RegisterPayload): Promise<RegisterResponse> {
        return apiClient.post<RegisterResponse, { data: { username: string; password: string; email: string; name: string; surname: string; role: string } }>(
            '/api/users/create',
            {
                data: {
                    username: payload.email,
                    password: payload.password,
                    email: payload.email,
                    name: payload.name,
                    surname: payload.surname ?? '',
                    role: 'USER',
                },
            },
            false,
        );
    },

    async getCurrentUser(): Promise<AuthUser> {
        const current = await apiClient.get<CurrentUserResponse>('/api/users/me', true);
        return normalizeUser(current);
    },

    logout(): void {
        tokenStorage.clearToken();
    },
};
