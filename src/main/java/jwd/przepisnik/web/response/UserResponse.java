package jwd.przepisnik.web.response;

import lombok.Value;

@Value
public class UserResponse {
    String username;
    String email;
    String name;
    String surname;
    String role;
}
