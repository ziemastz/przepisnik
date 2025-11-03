package jwd.przepisnik.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import jwd.przepisnik.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findById(UUID id);

    void deleteById(UUID id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
