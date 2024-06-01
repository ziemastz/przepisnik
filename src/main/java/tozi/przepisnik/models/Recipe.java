package tozi.przepisnik.models;

import java.util.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String directions;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "recipe_recipeingredients", referencedColumnName = "recipe_ingredient_id")
    private List<RecipeIngredient> recipeIngredients;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_chef", referencedColumnName = "chef_id")
    private Chef createdBy;
}
