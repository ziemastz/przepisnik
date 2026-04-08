const AUTH_TOKEN_KEY = 'authToken';

export const tokenStorage = {
    getToken(): string | null {
        return window.localStorage.getItem(AUTH_TOKEN_KEY);
    },
    setToken(token: string): void {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    clearToken(): void {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
    },
};
