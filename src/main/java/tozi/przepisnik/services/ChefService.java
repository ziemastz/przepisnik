package tozi.przepisnik.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tozi.przepisnik.dto.ChefDTO;
import tozi.przepisnik.models.Chef;
import tozi.przepisnik.repositories.ChefRepository;
import tozi.przepisnik.services.interfaces.IChefServer;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChefService implements IChefServer {

    @Autowired
    private ChefRepository chefRepository;

    @Override
    public void create(String name, Integer age) {
        Chef chef = new Chef();

        chef.setName(name);
        chef.setAge(age);

        this.chefRepository.save(chef);
    }

    @Override
    public ChefDTO find(String name) {
        ChefDTO chefDTO = new ChefDTO();
        Chef chef = this.chefRepository.findByName(name);

        chefDTO.setName(chef.getName());
        chefDTO.setAge(chef.getAge());

        return chefDTO;
    }

    @Override
    public List<ChefDTO> getAll() {
        List<ChefDTO> chefsDTO = new ArrayList<>();

        var chefs = this.chefRepository.findAll();
        for (Chef chef : chefs)
        {
            ChefDTO chefDTO = new ChefDTO();
            chefDTO.setName(chef.getName());
            chefDTO.setAge(chef.getAge());
            chefsDTO.add(chefDTO);
        }

        return chefsDTO;
    }

    @Override
    public void update(ChefDTO updateChef) {
        Chef chef = this.chefRepository.findByName(updateChef.getName());

        chef.setAge(updateChef.getAge());

        this.chefRepository.save(chef);
    }

    @Override
    public void delete(String name) {
        Chef chef = this.chefRepository.findByName(name);

        this.chefRepository.delete(chef);
    }
}