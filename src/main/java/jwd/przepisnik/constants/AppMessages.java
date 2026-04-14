package jwd.przepisnik.constants;

public final class AppMessages {
    private AppMessages() {
    }

    public static final String UNAUTHORIZED = "Unauthorized";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String INVALID_REQUEST_PAYLOAD = "Invalid request payload.";
    public static final String FIELD_ERROR_SEPARATOR = ": ";

    public static final class Controller {
        private Controller() {
        }

        public static final String MISSING_LOGIN_DATA = "Missing login data.";
        public static final String INVALID_USERNAME_OR_PASSWORD = "Invalid username or password.";
        public static final String MISSING_USER_DATA = "Missing user data.";
        public static final String MISSING_RECIPE_DATA = "Missing recipe data.";
        public static final String AUTH_USER_MISSING = "Brak uwierzytelnionego uzytkownika.";
        public static final String USER_BY_ID_NOT_FOUND = "Uzytkownik o podanym ID nie zostal znaleziony.";
        public static final String CURRENT_USER_NOT_FOUND = "Nie znaleziono aktualnie zalogowanego uzytkownika.";
        public static final String RECIPE_BY_ID_NOT_FOUND = "Przepis o podanym ID nie zostal znaleziony.";
    }

    public static final class Service {
        private Service() {
        }

        public static final String USER_DTO_REQUIRED = "Obiekt UserDto nie moze byc pusty.";
        public static final String RECIPE_REQUEST_REQUIRED = "Recipe request cannot be null.";
        public static final String AUTH_USER_NOT_FOUND = "Authenticated user was not found.";
        public static final String INGREDIENT_NAMES_UNIQUE = "Ingredient names must be unique within a recipe.";
        public static final String INGREDIENT_QUERY_EMPTY = "Query cannot be empty.";
        public static final String INGREDIENT_LIMIT_POSITIVE = "Limit must be greater than zero.";
        public static final String PASSWORD_EMPTY = "Has\u0142o nie mo\u017Ce by\u0107 puste.";

        public static final String USERNAME_EXISTS_PATTERN = "Uzytkownik z loginem '%s' juz istnieje.";
        public static final String EMAIL_EXISTS_PATTERN = "Uzytkownik z e-mailem '%s' juz istnieje.";
    }

    public static final class Json {
        private Json() {
        }

        public static final String INVALID_DECIMAL_FORMAT = "Invalid decimal number format. Use e.g. 0.5 or 0,5.";
    }

    public static final class Security {
        private Security() {
        }

        public static final String BEARER_PREFIX = "Bearer ";
        public static final String AUTHORIZATION_HEADER = "Authorization";
        public static final String DEFAULT_ROLE = "USER";
        public static final String ROLE_PREFIX = "ROLE_";
    }
}
