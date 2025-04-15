package com.yr.alquilercoches.controllers.wwwControllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.entities.CustomUserDetails;
import com.yr.alquilercoches.models.services.AlquilerService;
import com.yr.alquilercoches.models.services.CochesService;

@RestController
@RequestMapping("/api/alquiler") // Base de URL REST
public class AlquilerRestController {

    @Autowired
    private AlquilerService alquilerService;

    @Autowired
    private CochesService cochesService;

    // GET: Obtener todos los alquileres
    @GetMapping
    public ResponseEntity<List<Alquiler>> getAllAlquileres() {
        List<Alquiler> alquileres = alquilerService.getAll();
        return ResponseEntity.ok(alquileres);
    }

    // GET: Obtener un alquiler por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAlquilerById(@PathVariable Long id) {
        Alquiler alquiler = alquilerService.getId(id);
        if (alquiler != null) {
            return ResponseEntity.ok(alquiler);
        } else {
            return ResponseEntity.status(404).body("Alquiler no encontrado.");
        }
    }

    // POST: Reservar un coche
    @PostMapping("/reservar")
    public ResponseEntity<?> reservarCoche(@RequestParam Long cocheId,
                                           @RequestParam String fecha_inicio,
                                           @RequestParam String fecha_fin,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            // Verifica la disponibilidad del coche
            if (!alquilerService.isCarAvailable(cocheId, fecha_inicio, fecha_fin)) {
                return ResponseEntity.status(400).body("El coche no está disponible para estas fechas.");
            }

            // Crea el alquiler
            Alquiler alquiler = new Alquiler();
            alquiler.setCoche(cochesService.getId(cocheId));
            alquiler.setFecha_inicio(fecha_inicio);
            alquiler.setFecha_fin(fecha_fin);
            alquiler.setCliente(userDetails.getCliente());

            // Calcula el precio total
            BigDecimal precioBase = alquiler.getCoche().getPrecio();
            LocalDate start = LocalDate.parse(fecha_inicio);
            LocalDate end = LocalDate.parse(fecha_fin);
            long days = ChronoUnit.DAYS.between(start, end);
            BigDecimal precioTotal = precioBase.multiply(new BigDecimal(days));
            alquiler.setPrecio_total(precioTotal);

            alquilerService.create(alquiler);
            return ResponseEntity.ok("¡Reserva realizada con éxito!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al realizar la reserva: " + e.getMessage());
        }
    }

    // GET: Comprobar disponibilidad de un coche
    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(@RequestParam Long cocheId,
                                                      @RequestParam String startDate,
                                                      @RequestParam String endDate) {
        boolean disponible = alquilerService.isCarAvailable(cocheId, startDate, endDate);
        return ResponseEntity.ok(disponible);
    }
}
