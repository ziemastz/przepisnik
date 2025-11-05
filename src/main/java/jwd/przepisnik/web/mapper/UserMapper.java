package jwd.przepisnik.web.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jwd.przepisnik.models.User;
import jwd.przepisnik.web.dto.UserDto;

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

        validatePassword(dto.getPassword());

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setRole(dto.getRole());
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
            throw new IllegalArgumentException("HasĹ‚o nie moĹĽe byÄ‡ puste.");
        }
    }
}
