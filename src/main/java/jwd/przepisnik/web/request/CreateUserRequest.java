package jwd.przepisnik.web.request;

public record CreateUserRequest(
        String username,
        String password,
        String email,
        String name,
        String surname,
        String role) {
}
