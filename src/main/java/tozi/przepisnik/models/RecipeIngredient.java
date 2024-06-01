package tozi.przepisnik.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class RecipeIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_ingredient_id")
    private Integer recipeIngredientId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipeingredient_ingredient", referencedColumnName = "ingredient_id")
    private Ingredient ingredient;

    private Double quantity;

    private Unit unit;
}
