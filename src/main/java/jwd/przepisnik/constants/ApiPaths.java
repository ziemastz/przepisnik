package jwd.przepisnik.constants;

public final class ApiPaths {
    private ApiPaths() {
    }

    public static final String HOME = "/";
    public static final String INDEX_HTML = "/index.html";
    public static final String MANIFEST_JSON = "/manifest.json";
    public static final String ASSET_MANIFEST_JSON = "/asset-manifest.json";
    public static final String ROBOTS_TXT = "/robots.txt";
    public static final String STATIC_ALL = "/static/**";
    public static final String FAVICON_ICO = "/favicon.ico";

    public static final String API_ALL = "/api/**";
    public static final String H2_CONSOLE_ALL = "/h2-console/**";

    public static final class Auth {
        private Auth() {
        }

        public static final String BASE = "/api/auth";
        public static final String LOGIN = "/login";
        public static final String ALL = "/api/auth/**";
    }

    public static final class Users {
        private Users() {
        }

        public static final String BASE = "/api/users";
        public static final String CREATE = "/create";
        public static final String CREATE_FULL = "/api/users/create";
        public static final String UPDATE_BY_ID = "/update/{id}";
        public static final String DELETE_BY_ID = "/delete/{id}";
        public static final String BY_ID = "/{id:[0-9a-fA-F\\-]{36}}";
        public static final String ME = "/me";
    }

    public static final class Recipes {
        private Recipes() {
        }

        public static final String BASE = "/api/recipes";
        public static final String CREATE = "/create";
        public static final String MY = "/my";
        public static final String PUBLIC = "/public";
        public static final String PUBLIC_FULL = "/api/recipes/public";
        public static final String PUBLIC_BY_ID = "/public/{id:[0-9a-fA-F\\-]{36}}";
        public static final String PUBLIC_BY_ID_FULL = "/api/recipes/public/{id:[0-9a-fA-F\\-]{36}}";
        public static final String BY_ID = "/{id:[0-9a-fA-F\\-]{36}}";
        public static final String UPDATE_BY_ID = "/update/{id}";
        public static final String DELETE_BY_ID = "/delete/{id}";
    }

    public static final class Ingredients {
        private Ingredients() {
        }

        public static final String BASE = "/api/ingredients";
        public static final String SEARCH = "/search";
        public static final String LIST = "/list";
        public static final String CREATE = "/create";
        public static final String BY_ID = "/{id:[0-9a-fA-F\\-]{36}}";
        public static final String UPDATE_BY_ID = "/update/{id}";
        public static final String DELETE_BY_ID = "/delete/{id}";
        public static final String QUERY_PARAM = "query";
        public static final String LIMIT_PARAM = "limit";
    }

    public static final class React {
        private React() {
        }

        public static final String ROOT = "/";
        public static final String SPA_FALLBACK = "/{path:^(?!api|static|h2-console)(?!.*\\.).*$}/**";
        public static final String FORWARD_INDEX = "forward:/index.html";
    }
}
