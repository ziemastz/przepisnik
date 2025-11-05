package jwd.przepisnik.web.request;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String password;
    private String email;
    private String name;
    private String surname;
    private String role;
}
