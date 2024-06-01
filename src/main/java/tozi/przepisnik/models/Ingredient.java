package tozi.przepisnik.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
public class Ingredient {
    @Id
    private Integer id;

    private String name;

    private boolean isVegetarian;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ingredient id", referencedColumnName = "ingredient_id", nullable = true)
    private Nutrients nutrients;
}
