package tozi.przepisnik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tozi.przepisnik.models.Chef;

@Repository
public interface ChefRepository extends JpaRepository<Chef, Integer> {
    Chef findByName(String name);
}
