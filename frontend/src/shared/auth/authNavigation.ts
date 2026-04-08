const AUTH_PATHS = ['/login', '/register'];

const isAuthPath = (path: string): boolean => AUTH_PATHS.includes(path);

export const sanitizeAuthOrigin = (origin?: string | null): string => {
    if (!origin || isAuthPath(origin)) {
        return '/';
    }

    return origin;
};

export const resolveAuthOriginForNavigation = (
    currentPath: string,
    navigationState?: { from?: string } | null,
): string => {
    const stateFrom = navigationState?.from;

    if (stateFrom && !isAuthPath(stateFrom)) {
        return stateFrom;
    }

    if (!isAuthPath(currentPath)) {
        return currentPath;
    }

    return '/';
};
