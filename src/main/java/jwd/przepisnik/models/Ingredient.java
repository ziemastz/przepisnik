package jwd.przepisnik.models;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Data
@Table(name = "ingredients", uniqueConstraints = {
        @UniqueConstraint(columnNames = "normalized_name")
})
public class Ingredient {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "normalized_name", nullable = false)
    private String normalizedName;

    // Nutritional values per 100g or 100ml (BTW - Białko, Tłuszcz, Węglowodany)
    @Column(precision = 10, scale = 2)
    private BigDecimal protein; // Białko

    @Column(precision = 10, scale = 2)
    private BigDecimal fat; // Tłuszcz

    @Column(precision = 10, scale = 2)
    private BigDecimal carbohydrates; // Węglowodany
}
