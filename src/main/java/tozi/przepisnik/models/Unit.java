package tozi.przepisnik.models;

public enum Unit {
    GRAM,
    MILLILITERS,
    GLASS,
    CUP,
    TABLESPOON,
    TEASPOON,
    PINCH;

    @Override
    public String toString() {
        return switch (this) {
            case GRAM -> "g";
            case MILLILITERS -> "mL";
            case GLASS, CUP, TABLESPOON, TEASPOON, PINCH -> super.toString().toLowerCase();
            default -> "";
        };
    }
}
