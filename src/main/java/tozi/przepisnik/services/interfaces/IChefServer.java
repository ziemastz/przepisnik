package tozi.przepisnik.services.interfaces;

import java.util.*;
import tozi.przepisnik.dto.ChefDTO;
import tozi.przepisnik.dto.UserDTO;

public interface IChefServer {
    void Create(ChefDTO newChef);
    ChefDTO Find(String name);
    List<ChefDTO> GetAll();
    void Update(ChefDTO chef);
    void Delete(String name);
    boolean Login(UserDTO user);
    void Logout();
}