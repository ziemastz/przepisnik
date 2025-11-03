package jwd.przepisnik.web.response;

import lombok.Value;

@Value
public class LoginResponse {
    String token;
    String type;

    public LoginResponse(String token) {
        this.token = token;
        this.type = "Bearer";
    }
}
