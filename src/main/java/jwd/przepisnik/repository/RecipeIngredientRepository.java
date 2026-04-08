package jwd.przepisnik.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import jwd.przepisnik.models.RecipeIngredient;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, UUID> {
}
