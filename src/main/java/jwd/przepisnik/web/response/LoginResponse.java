package jwd.przepisnik.web.response;

public record LoginResponse(String token, String type) {

    public LoginResponse(String token) {
        this(token, "Bearer");
    }
}
