package JWD.Przepisnik.web.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import JWD.Przepisnik.models.User;
import JWD.Przepisnik.web.dto.UserDto;

@Component
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }

        validatePassword(dto.password);

        User user = new User();
        user.setUsername(dto.username);
        user.setPasswordHash(passwordEncoder.encode(dto.password));
        user.setEmail(dto.email);
        user.setName(dto.name);
        user.setSurname(dto.surname);
        user.setRole(dto.role);
        return user;
    }

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return new UserDto(
                user.getUsername(),
                null,
                user.getEmail(),
                user.getName(),
                user.getSurname(),
                user.getRole());
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Hasło nie może być puste.");
        }
    }
}
