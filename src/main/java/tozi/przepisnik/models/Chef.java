package tozi.przepisnik.models;

import java.util.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Chef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chef_id")
    private Integer chefId;

    private String username;

    private String password;

    private String name;

    private String email;

    private Integer age;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createdBy")
    private List<Recipe> recipes;

    private Role role;
}
