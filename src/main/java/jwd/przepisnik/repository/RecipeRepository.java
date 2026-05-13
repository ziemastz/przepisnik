package jwd.przepisnik.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jwd.przepisnik.models.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {
    @EntityGraph(attributePaths = { "author", "ingredients", "ingredients.ingredient" })
    Optional<Recipe> findByIdAndAuthorId(UUID id, UUID authorId);

    @EntityGraph(attributePaths = { "author", "ingredients", "ingredients.ingredient" })
    Optional<Recipe> findByIdAndPrivateRecipeFalse(UUID id);

    @EntityGraph(attributePaths = { "author", "ingredients", "ingredients.ingredient" })
    List<Recipe> findAllByAuthorIdOrderByCreatedAtDesc(UUID authorId);

    @Query("SELECT DISTINCT r FROM Recipe r"
            + " LEFT JOIN FETCH r.author"
            + " LEFT JOIN FETCH r.ingredients ri"
            + " LEFT JOIN FETCH ri.ingredient"
            + " WHERE r.privateRecipe = false"
            + " AND (:query IS NULL"
            + "      OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%'))"
            + "      OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))"
            + " ORDER BY r.createdAt DESC")
    List<Recipe> findPublicRecipes(@Param("query") String query);
}
