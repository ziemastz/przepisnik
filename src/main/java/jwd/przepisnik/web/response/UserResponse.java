package jwd.przepisnik.web.response;

public record UserResponse(
        String username,
        String email,
        String name,
        String surname,
        String role) {
}
