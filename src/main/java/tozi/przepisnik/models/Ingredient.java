package tozi.przepisnik.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Integer ingredientId;

    private String name;

    private boolean isVegetarian;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ingredient nutrients", referencedColumnName = "nutrients_id", nullable = true)
    private Nutrients nutrients;
}
