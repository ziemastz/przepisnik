export const uppercaseFirstCharacter = (value: string): string => {
    if (!value) {
        return value;
    }

    return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`;
};

export const formatMacro = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
        return '-';
    }

    return `${parseFloat(value.toFixed(2))}g`;
};

export const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
        return '-';
    }

    return `${parseFloat(value.toFixed(2))}`;
};

export const colorForZoRating = (rating: string | null | undefined): string => {
    switch (rating) {
        case 'IDEAL':
            return 'recipe-zo-value--ideal';
        case 'GOOD':
            return 'recipe-zo-value--good';
        case 'AVERAGE':
            return 'recipe-zo-value--average';
        case 'POOR':
            return 'recipe-zo-value--poor';
        default:
            return 'recipe-zo-value--default';
    }
};