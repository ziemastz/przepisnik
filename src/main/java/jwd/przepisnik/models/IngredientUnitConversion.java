package jwd.przepisnik.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "ingredient_unit_conversions")
public class IngredientUnitConversion {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private IngredientUnit unit;

    @Column(name = "grams_per_unit", nullable = false, precision = 10, scale = 2)
    private BigDecimal gramsPerUnit;
}
