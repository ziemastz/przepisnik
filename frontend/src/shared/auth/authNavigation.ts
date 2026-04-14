import constants from '../../constants';

const AUTH_PATHS = [constants.routes.login, constants.routes.register];

const isAuthPath = (path: string): boolean => AUTH_PATHS.includes(path);

export const sanitizeAuthOrigin = (origin?: string | null): string => {
    if (!origin || isAuthPath(origin)) {
        return constants.routes.home;
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

    return constants.routes.home;
};
