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