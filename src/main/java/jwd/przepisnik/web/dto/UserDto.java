package jwd.przepisnik.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private String username;
    private String password;
    private String email;
    private String name;
    private String surname;
    private String role;
}
