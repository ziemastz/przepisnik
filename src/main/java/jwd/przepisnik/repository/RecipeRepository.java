package jwd.przepisnik.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import jwd.przepisnik.models.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {
    @EntityGraph(attributePaths = { "author", "ingredients", "ingredients.ingredient" })
    Optional<Recipe> findByIdAndAuthorId(UUID id, UUID authorId);

    @EntityGraph(attributePaths = { "author", "ingredients", "ingredients.ingredient" })
    List<Recipe> findAllByAuthorIdOrderByCreatedAtDesc(UUID authorId);
}
