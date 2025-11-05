package jwd.przepisnik.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import jwd.przepisnik.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    @NonNull
    Optional<User> findById(@NonNull UUID id);

    void deleteById(@NonNull UUID id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
