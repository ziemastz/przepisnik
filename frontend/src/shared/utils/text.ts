export const uppercaseFirstCharacter = (value: string): string => {
    if (!value) {
        return value;
    }

    return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`;
};