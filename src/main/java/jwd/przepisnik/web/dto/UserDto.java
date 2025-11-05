package jwd.przepisnik.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    public String username;
    public String password;
    public String email;
    public String name;
    public String surname;
    public String role;
}
