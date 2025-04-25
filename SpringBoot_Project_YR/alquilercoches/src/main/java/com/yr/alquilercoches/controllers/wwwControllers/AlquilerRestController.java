package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.yr.alquilercoches.models.entities.*;
import com.yr.alquilercoches.models.services.*;
import java.util.Map;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/alquileres")
@CrossOrigin(origins = "http://localhost:5173")
public class AlquilerRestController {

    @Autowired
    private AlquilerService alquilerService;

    @Autowired
    private CochesService cochesService;

    @Autowired
    private ClienteService clienteService;
   
    @GetMapping
    public ResponseEntity<List<Alquiler>> getAllAlquileres() {
        List<Alquiler> alquileres = alquilerService.getAll();
        return ResponseEntity.ok(alquileres);
    }

    // comprobar disponibilidad de un coche
    @GetMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam Long cocheId,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        try {
            boolean isAvailable = alquilerService.isCarAvailable(cocheId, fechaInicio, fechaFin);
            return ResponseEntity.ok(Map.of("available", isAvailable));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("available", false));
        }
    }

    //calcular precio total de un alquiler
@GetMapping("/calcular-precio")
public ResponseEntity<Map<String, BigDecimal>> calcularPrecio(
    @RequestParam Long cocheId,
    @RequestParam String fechaInicio,
    @RequestParam String fechaFin
) {
    try {
        Coches coche = cochesService.getId(cocheId);
        if (coche == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);
        
        long days = ChronoUnit.DAYS.between(inicio, fin) + 1;
        
        BigDecimal precioTotal = coche.getPrecio().multiply(BigDecimal.valueOf(days));
        
        return ResponseEntity.ok(Map.of("precioTotal", precioTotal));
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}
    // Create new rental
    @PostMapping
public ResponseEntity<?> createAlquiler(@RequestBody AlquilerDTO alquilerDTO) {
    try {
        // crea el objeto Alquiler a partir del DTO 
        Alquiler newAlquiler = new Alquiler();
        newAlquiler.setCoche(cochesService.getId(alquilerDTO.getCocheId()));
        newAlquiler.setCliente(clienteService.getId(alquilerDTO.getClienteId()));
        newAlquiler.setFecha_inicio(alquilerDTO.getFecha_inicio());
        newAlquiler.setFecha_fin(alquilerDTO.getFecha_fin());
        newAlquiler.setPrecio_total(alquilerDTO.getPrecio_total());
        
        // verifica si el coche está disponible para las fechas seleccionadas
        if (!alquilerService.isCarAvailable(
                alquilerDTO.getCocheId(),
                alquilerDTO.getFecha_inicio(),
                alquilerDTO.getFecha_fin())) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "El coche no está disponible para las fechas seleccionadas"));
        }
        
        // guarda el alquiler
        Alquiler saved = alquilerService.create(newAlquiler);
        return ResponseEntity.status(201).body(saved);
    } catch (Exception e) {
        e.printStackTrace(); 
        return ResponseEntity
            .status(500)
            .body(Map.of("message", "Error al crear el alquiler: " + e.getMessage()));
    }
}
}