import constants from '../../constants';

export interface BackendFieldError {
    path: string[];
    message: string;
    raw: string;
}

const splitPath = (rawPath: string): string[] => {
    const normalizedPath = rawPath.trim().replace(/^data\./i, '');
    const parts: string[] = [];

    normalizedPath.replace(/([^.[\]]+)|\[(\d+)\]/g, (_, key: string, index: string) => {
        if (key) {
            parts.push(key);
        }

        if (index !== undefined) {
            parts.push(index);
        }

        return '';
    });

    return parts;
};

const normalizeMessage = (value: string): string => {
    const text = value.trim();

    if (/must not be null|nie moze miec wartosci null|nie może mieć wartości null/i.test(text)) {
        return constants.recipes.form.errors.requiredField;
    }

    if (/must not be blank|must not be empty|nie moze byc puste|nie może być puste/i.test(text)) {
        return constants.recipes.form.errors.requiredField;
    }

    const minMatch = text.match(/(?:must be greater than or equal to|musi byc wieksza? lub rowna?|musi być większa? lub równa?)\s*([0-9]+(?:[.,][0-9]+)?)/i);
    if (minMatch) {
        return `${constants.recipes.form.errors.minValuePrefix} ${minMatch[1].replace(',', '.')}.`;
    }

    return text;
};

export const parseBackendFieldError = (rawMessage: string): BackendFieldError | null => {
    const trimmed = rawMessage.trim();
    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex <= 0) {
        return null;
    }

    const rawPath = trimmed.slice(0, separatorIndex).trim();
    const message = normalizeMessage(trimmed.slice(separatorIndex + 1));
    const path = splitPath(rawPath);

    if (path.length === 0) {
        return null;
    }

    return {
        path,
        message,
        raw: rawMessage,
    };
};

export const prettifyValidationMessage = (rawMessage: string): string => {
    const parsed = parseBackendFieldError(rawMessage);
    return parsed?.message ?? normalizeMessage(rawMessage);
};
