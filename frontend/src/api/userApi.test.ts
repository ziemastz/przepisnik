import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import { userApi } from './userApi';

describe('userApi', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        window.localStorage.clear();
    });

    test('maps login payload and loads current user', async () => {
        const postSpy = jest.spyOn(apiClient, 'post')
            .mockResolvedValueOnce({ token: 'jwt', type: 'Bearer' } as never);
        const getSpy = jest.spyOn(apiClient, 'get')
            .mockResolvedValueOnce({
                username: 'john@example.com',
                email: 'john@example.com',
                name: 'John',
                surname: 'Doe',
                role: 'USER',
            } as never);

        const result = await userApi.login({ email: 'john@example.com', password: 'pass1234' });

        expect(postSpy).toHaveBeenCalledWith(
            '/api/auth/login',
            { data: { username: 'john@example.com', password: 'pass1234' } },
            false,
        );
        expect(getSpy).toHaveBeenCalledWith('/api/users/me', true);
        expect(tokenStorage.getToken()).toEqual('jwt');
        expect(result.email).toEqual('john@example.com');
    });

    test('maps register payload to backend contract', async () => {
        const postSpy = jest.spyOn(apiClient, 'post')
            .mockResolvedValueOnce({ id: '123' } as never);

        await userApi.register({
            email: 'john@example.com',
            password: 'pass1234',
            name: 'John',
            surname: 'Doe',
        });

        expect(postSpy).toHaveBeenCalledWith(
            '/api/users/create',
            {
                data: {
                    username: 'john@example.com',
                    password: 'pass1234',
                    email: 'john@example.com',
                    name: 'John',
                    surname: 'Doe',
                    role: 'USER',
                },
            },
            false,
        );
    });

    test('clears token on logout', () => {
        tokenStorage.setToken('jwt');

        userApi.logout();

        expect(tokenStorage.getToken()).toBeNull();
    });
});
