package jwd.przepisnik.web.dto;

public record UserDto(
        String username,
        String password,
        String email,
        String name,
        String surname,
        String role) {
}
