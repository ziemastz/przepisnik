package jwd.przepisnik.web.response;

import jwd.przepisnik.constants.AppMessages;

public record LoginResponse(String token, String type) {

    public LoginResponse(String token) {
        this(token, AppMessages.Security.BEARER_SCHEME);
    }
}
