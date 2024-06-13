package tozi.przepisnik.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

/**
 * Nutrients in 100 grams of the ingredient.
 */
@Entity
@Data
@NoArgsConstructor
public class Nutrients {
    @Id
    private Integer nutrientsId;

    private double proteins;

    private double fats;

    private double carbohydrates;
}
