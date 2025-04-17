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
    public List<Alquiler> getActiveRentals(Long clienteId) {
        String currentDate = LocalDate.now().toString();
        return alquilerRepository.findActiveRentalsByClienteId(clienteId, currentDate);
    }
    public boolean isCarAvailable(Long cocheId, String startDate, String endDate) {
        LocalDate requestStart = LocalDate.parse(startDate);
        LocalDate requestEnd = LocalDate.parse(endDate);
        
        List<Alquiler> existingRentals = alquilerRepository.findByCocheId(cocheId);
        
        // If no existing rentals, car is available
        if (existingRentals.isEmpty()) {
            return true;
        }
        
        // Check each existing rental for overlap
        for (Alquiler rental : existingRentals) {
            LocalDate rentalStart = LocalDate.parse(rental.getFecha_inicio());
            LocalDate rentalEnd = LocalDate.parse(rental.getFecha_fin());
            
            // Overlap check: if either the start or end date falls within an existing rental period
            boolean hasOverlap = !(
                requestEnd.isBefore(rentalStart) || // Requested period ends before rental starts
                requestStart.isAfter(rentalEnd)     // Requested period starts after rental ends
            );
            
            if (hasOverlap) {
                return false; // Car is not available
            }
        }
        
        return true; // No overlaps found, car is available
    }

    
}
