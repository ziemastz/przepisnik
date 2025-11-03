package jwd.przepisnik.models;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Data
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "username", "email" })
})
public class User {
    @Id
    @GeneratedValue
    private UUID id;
    private String username;
    private String passwordHash;
    private String email;
    private String name;
    private String surname;
    private String role;
}
