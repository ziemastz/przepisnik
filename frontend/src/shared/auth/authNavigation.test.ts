import { resolveAuthOriginForNavigation, sanitizeAuthOrigin } from './authNavigation';

describe('authNavigation', () => {
    test('sanitizeAuthOrigin returns home for auth pages and empty origin', () => {
        expect(sanitizeAuthOrigin(undefined)).toBe('/');
        expect(sanitizeAuthOrigin('/login')).toBe('/');
        expect(sanitizeAuthOrigin('/register')).toBe('/');
    });

    test('sanitizeAuthOrigin keeps non-auth path', () => {
        expect(sanitizeAuthOrigin('/recipes/42')).toBe('/recipes/42');
    });

    test('resolveAuthOriginForNavigation keeps existing non-auth state.from while on auth page', () => {
        expect(resolveAuthOriginForNavigation('/login', { from: '/recipes/42' })).toBe('/recipes/42');
        expect(resolveAuthOriginForNavigation('/register', { from: '/dashboard' })).toBe('/dashboard');
    });

    test('resolveAuthOriginForNavigation does not replace origin with auth pages', () => {
        expect(resolveAuthOriginForNavigation('/login', { from: '/register' })).toBe('/');
        expect(resolveAuthOriginForNavigation('/register', { from: '/login' })).toBe('/');
    });

    test('resolveAuthOriginForNavigation uses current path when outside auth pages', () => {
        expect(resolveAuthOriginForNavigation('/recipes/42', null)).toBe('/recipes/42');
    });
});
