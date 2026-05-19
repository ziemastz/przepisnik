package jwd.przepisnik.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jwd.przepisnik.models.IngredientUnit;
import jwd.przepisnik.models.IngredientUnitConversion;

public interface IngredientUnitConversionRepository extends JpaRepository<IngredientUnitConversion, IngredientUnit> {
}
