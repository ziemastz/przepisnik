package tozi.przepisnik.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tozi.przepisnik.dto.ChefDTO;
import tozi.przepisnik.dto.UserDTO;
import tozi.przepisnik.services.interfaces.IChefServer;

import java.util.List;

@RestController
@RequestMapping("chef")
public class ChefController {
    @Autowired
    private IChefServer chefServer;

    @PostMapping("/add")
    public void addChef(@RequestBody ChefDTO chef) {
        this.chefServer.Create(chef);
    }

    @GetMapping("/{name}")
    public ChefDTO getChef(@PathVariable String name) {
        return this.chefServer.Find(name);
    }

    @GetMapping("/")
    public List<ChefDTO> getAllChef() {
        return this.chefServer.GetAll();
    }

    @PutMapping("/update")
    public void updateChef(@RequestBody ChefDTO chef) {
        this.chefServer.Update(chef);
    }

    @DeleteMapping("/delete/{name}")
    public void deleteChef(@PathVariable String name) {
        this.chefServer.Delete(name);
    }

    @PostMapping("/login")
    public boolean login(@RequestBody UserDTO user) {
        return this.chefServer.Login(user);
    }

    @PostMapping("/logout")
    public void logout() {
        this.chefServer.Logout();
    }
}
