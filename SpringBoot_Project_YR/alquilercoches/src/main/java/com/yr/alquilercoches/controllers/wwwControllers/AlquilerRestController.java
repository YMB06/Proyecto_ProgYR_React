package com.yr.alquilercoches.controllers.wwwControllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.entities.Coches;
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
 // Calcula precio total para un alquiler
 @GetMapping("/calcular-precio")
 public ResponseEntity<?> calcularPrecio(
     @RequestParam Long cocheId,
     @RequestParam String fecha_inicio,
     @RequestParam String fecha_fin
 ) {
     try {
         LocalDate start = LocalDate.parse(fecha_inicio);
         LocalDate end = LocalDate.parse(fecha_fin);

         if (start.isAfter(end)) {
             return ResponseEntity.badRequest().body("La fecha de fin debe ser posterior a la de inicio.");
         }

         long days = ChronoUnit.DAYS.between(start, end) + 1;
         BigDecimal precioBase = cochesService.getId(cocheId).getPrecio();
         BigDecimal precioTotal = precioBase.multiply(BigDecimal.valueOf(days));

         return ResponseEntity.ok(Map.of("precioTotal", precioTotal));
     } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity.status(500).body("Error al calcular el precio: " + e.getMessage());
     }
 }

 // Reserva coche desde React
 @PostMapping("/reservar")
 public ResponseEntity<?> reservarCoche(
     @RequestParam Long cocheId,
     @RequestParam String fecha_inicio,
     @RequestParam String fecha_fin,
     @AuthenticationPrincipal CustomUserDetails userDetails
 ) {
     try {
         LocalDate start = LocalDate.parse(fecha_inicio);
         LocalDate end = LocalDate.parse(fecha_fin);

         if (start.isAfter(end)) {
             return ResponseEntity.badRequest().body("La fecha de fin debe ser posterior a la de inicio.");
         }

         if (!alquilerService.isCarAvailable(cocheId, fecha_inicio, fecha_fin)) {
             return ResponseEntity.badRequest().body("El coche no está disponible para esas fechas.");
         }

         long days = ChronoUnit.DAYS.between(start, end) + 1;
         BigDecimal precioBase = cochesService.getId(cocheId).getPrecio();
         BigDecimal precioTotal = precioBase.multiply(BigDecimal.valueOf(days));

         Alquiler alquiler = new Alquiler();
         alquiler.setCoche(cochesService.getId(cocheId));
         alquiler.setFecha_inicio(fecha_inicio);
         alquiler.setFecha_fin(fecha_fin);
         alquiler.setCliente(userDetails.getCliente());
         alquiler.setPrecio_total(precioTotal);

         alquilerService.create(alquiler);

         return ResponseEntity.ok(Map.of(
             "mensaje", "¡Reserva realizada con éxito!",
             "dias", days,
             "precioTotal", precioTotal
         ));

     } catch (Exception e) {
         e.printStackTrace();
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
