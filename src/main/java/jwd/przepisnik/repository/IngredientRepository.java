package jwd.przepisnik.repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import jwd.przepisnik.models.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, UUID> {
    Optional<Ingredient> findByNormalizedName(String normalizedName);

    List<Ingredient> findByNormalizedNameStartingWithOrderByNormalizedNameAsc(String normalizedPrefix, Pageable pageable);
}
