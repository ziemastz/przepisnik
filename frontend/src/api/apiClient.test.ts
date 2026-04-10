import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';

describe('apiClient', () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        globalThis.fetch = fetchMock as unknown as typeof fetch;
        window.localStorage.clear();
    });

    test('returns response data for successful request', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ success: true, errorMessages: [], data: { token: 'a' } }),
        });

        const result = await apiClient.post<{ token: string }, { data: { username: string; password: string } }>(
            '/api/auth/login',
            { data: { username: 'john', password: 'secret' } },
            false,
        );

        expect(result).toEqual({ token: 'a' });
    });

    test('adds authorization header for authenticated calls', async () => {
        tokenStorage.setToken('jwt-123');
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ success: true, errorMessages: [], data: { username: 'john' } }),
        });

        await apiClient.get<{ username: string }>('/api/users/me', true);

        expect(fetchMock).toHaveBeenCalledWith('/api/users/me', expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Bearer jwt-123',
            }),
        }));
    });

    test('throws ApiError when server returns envelope failure', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ success: false, errorMessages: ['Validation error'], data: null }),
        });

        await expect(apiClient.get('/api/users/me', true)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                messages: ['Validation error'],
            }),
        );
    });

    test('maps 404 html response to user-friendly backend connectivity error', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 404,
            text: async () => '<!DOCTYPE html><html><body>Not found</body></html>',
        });

        await expect(apiClient.post('/api/users/create', { data: {} }, false)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                messages: [
                    'Nie mozna polaczyc z API. Sprawdz czy backend dziala i czy frontend ma poprawna konfiguracje proxy.',
                ],
            }),
        );
    });

    test('allows empty data payload for successful void request', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ success: true, errorMessages: [], data: null }),
        });

        await expect(apiClient.postVoid('/api/recipes/delete/123', { data: {} }, true)).resolves.toBeUndefined();
    });

    test('allows empty body (HTTP 204) for successful void request', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 204,
            text: async () => '',
        });

        await expect(apiClient.postVoid('/api/recipes/delete/123', { data: {} }, true)).resolves.toBeUndefined();
    });

    test('throws ApiError with status 0 when fetch network call fails', async () => {
        fetchMock.mockRejectedValue(new Error('Network down'));

        await expect(apiClient.get('/api/users/me', false)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                status: 0,
            }),
        );
    });

    test('maps 401 with empty body to security config error message', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 401,
            text: async () => '',
        });

        await expect(apiClient.get('/api/users/me', true)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                messages: [
                    'Serwer odrzucil zapytanie. Sprawdz konfiguracje bezpieczenstwa backendu i sprobuj ponownie.',
                ],
            }),
        );
    });

    test('maps 500 response to server unavailable message', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => JSON.stringify({ success: false, errorMessages: [], data: null }),
        });

        await expect(apiClient.get('/api/users/me', false)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                messages: ['Serwer jest chwilowo niedostepny. Sprobuj ponownie za moment.'],
            }),
        );
    });

    test('throws ApiError when response ok but envelope data is null without allowEmptyData', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ success: true, errorMessages: [], data: null }),
        });

        await expect(apiClient.get('/api/users/me', false)).rejects.toEqual(
            expect.objectContaining({
                name: 'ApiError',
                messages: ['Missing response payload.'],
            }),
        );
    });
});
