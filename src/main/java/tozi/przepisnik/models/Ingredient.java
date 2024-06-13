package tozi.przepisnik.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ingredientId;

    private String name;

    private boolean isVegetarian;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Nutrients nutrients;
}
