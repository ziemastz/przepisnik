package tozi.przepisnik.services.interfaces;

import java.util.*;
import tozi.przepisnik.dto.ChefDTO;

public interface IChefServer {
    void create(String name, Integer age);
    ChefDTO find(String name);
    List<ChefDTO> getAll();
    void update(ChefDTO chef);
    void delete(String name);
}