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
    private List<RecipeIngredient> recipeIngredients;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Chef createdBy;
}
