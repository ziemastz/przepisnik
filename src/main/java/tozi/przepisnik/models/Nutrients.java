package tozi.przepisnik.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
public class Nutrients {
    @Id
    @Column(name = "ingredient_id")
    private Integer ingredientId;

    private double proteins;

    private double fats;

    private double carbohydrates;
}
