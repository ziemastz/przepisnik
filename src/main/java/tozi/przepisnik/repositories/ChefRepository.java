package tozi.przepisnik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tozi.przepisnik.models.Chef;

public interface ChefRepository extends JpaRepository<Chef, Integer> {
    Chef findByName(String name);

    Chef findByUsername(String username);
}
