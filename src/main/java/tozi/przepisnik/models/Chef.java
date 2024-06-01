package tozi.przepisnik.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Chef {
    @Id
    private Integer id;

    private String name;

    private int age;
}
