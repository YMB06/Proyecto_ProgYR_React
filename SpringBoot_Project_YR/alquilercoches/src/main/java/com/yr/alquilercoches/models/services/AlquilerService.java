package com.yr.alquilercoches.models.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.repositories.AlquilerRepository;

@Service
public class AlquilerService {

    @Autowired
    AlquilerRepository alquilerRepository;

    public List<Alquiler> getAll(){
        return this.alquilerRepository.findAll();
    }
    
    //create
    public Alquiler create(Alquiler alquiler){
        return this.alquilerRepository.save(alquiler);
    }

    //update
    public Alquiler update(Alquiler alquiler){
        return this.alquilerRepository.save(alquiler);
    }

    //delete
    public void delete(Alquiler alquiler){
        this.alquilerRepository.delete(alquiler);
    }

    public void deleteById(Long id){
        this.alquilerRepository.deleteById(id);
    }
    public Alquiler getId(Long id){
        Alquiler alquiler = this.alquilerRepository.findById(id).get();
        System.out.println(alquiler);
        return alquiler;
    }

    public List<Alquiler> findByCocheId(Long cocheId) {
        return alquilerRepository.findByCocheId(cocheId);
    }

    public List<Alquiler> findByClienteId(Long clienteId) {
        return alquilerRepository.findByClienteId(clienteId);
    }

    public List<Alquiler> getUltimosAlquileres(int limit) {
        return alquilerRepository.findTop10ByOrderByIdDesc();
    }

    public boolean isCarAvailable(Long cocheId, String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        // Get all rentals for this car
        List<Alquiler> alquileres = alquilerRepository.findByCocheId(cocheId);
        
        // Check for overlapping rentals
        for (Alquiler alquiler : alquileres) {
            LocalDate alquilerStart = LocalDate.parse(alquiler.getFecha_inicio());
            LocalDate alquilerEnd = LocalDate.parse(alquiler.getFecha_fin());
            
            // Check if dates overlap
            if (!(end.isBefore(alquilerStart) || start.isAfter(alquilerEnd))) {
                return false; // Dates overlap, car is not available
            }
        }
        
        return true; // No overlapping rentals found
    }

    
}
