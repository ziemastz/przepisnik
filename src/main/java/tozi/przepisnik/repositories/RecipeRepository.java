package tozi.przepisnik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tozi.przepisnik.models.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

}
