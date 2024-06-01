package tozi.przepisnik.services;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tozi.przepisnik.dto.ChefDTO;
import tozi.przepisnik.dto.UserDTO;
import tozi.przepisnik.models.Chef;
import tozi.przepisnik.repositories.ChefRepository;
import tozi.przepisnik.services.interfaces.IChefServer;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChefService implements IChefServer {

    @Autowired
    private ChefRepository chefRepository;

    private Chef loggedChef = new Chef();

    @Override
    public void Create(ChefDTO newChef) {
        Chef chef = new Chef();

        chef.setName(newChef.getName());
        chef.setPassword(DigestUtils.sha256Hex(newChef.getPassword()));
        chef.setEmail(newChef.getEmail());
        chef.setAge(newChef.getAge());

        this.chefRepository.save(chef);
    }

    @Override
    public ChefDTO Find(String name) {
        ChefDTO chefDTO = new ChefDTO();
        Chef chef = this.chefRepository.findByName(name);

        chefDTO.setName(chef.getName());
        chefDTO.setEmail(chef.getEmail());
        chefDTO.setAge(chef.getAge());

        return chefDTO;
    }

    @Override
    public List<ChefDTO> GetAll() {
        List<ChefDTO> chefsDTO = new ArrayList<>();

        var chefs = this.chefRepository.findAll();
        for (Chef chef : chefs) {
            ChefDTO chefDTO = new ChefDTO();

            chefDTO.setName(chef.getName());
            chefDTO.setEmail(chef.getEmail());
            chefDTO.setAge(chef.getAge());

            chefsDTO.add(chefDTO);
        }

        return chefsDTO;
    }

    @Override
    public void Update(ChefDTO updateChef) {
        Chef chef = this.chefRepository.findByName(updateChef.getName());

        chef.setAge(updateChef.getAge());

        this.chefRepository.save(chef);
    }

    @Override
    public void Delete(String name) {
        Chef chef = this.chefRepository.findByName(name);

        this.chefRepository.delete(chef);
    }

    @Override
    public boolean Login(UserDTO user) {
        Chef chef = this.chefRepository.findByUsername(user.getUsername());
        if (chef.getPassword().equals(DigestUtils.sha256Hex(user.getPassword()))) {
            this.loggedChef = chef;

            return true;
        }

        return false;
    }

    @Override
    public void Logout() {
        this.loggedChef = new Chef();
    }
}