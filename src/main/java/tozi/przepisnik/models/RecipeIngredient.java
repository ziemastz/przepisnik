package tozi.przepisnik.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class RecipeIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recipeIngredientId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Ingredient ingredient;

    private Double quantity;

    private Unit unit;
}
