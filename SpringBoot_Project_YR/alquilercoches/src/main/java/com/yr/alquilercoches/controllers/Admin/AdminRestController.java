package com.yr.alquilercoches.controllers.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.services.AlquilerService;
import com.yr.alquilercoches.models.services.ClienteService;
import com.yr.alquilercoches.models.services.CochesService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin") 
public class AdminRestController {

    @Autowired
    private CochesService cochesService;

    @Autowired
    private AlquilerService alquilerService;

    @Autowired
    private ClienteService clienteService;

    // GET: Resumen administrativo
    @GetMapping("/index")
    public ResponseEntity<?> getAdminSummary() {
        try {
            // Calcula los totales
            int totalCoches = cochesService.getAll().size();
            int totalAlquileres = alquilerService.getAll().size();
            int totalClientes = clienteService.getAll().size();
            BigDecimal totalIngresos = alquilerService.getAll().stream()
                    .map(Alquiler::getPrecio_total)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Obtiene los últimos 10 alquileres
            List<Alquiler> ultimosAlquileres = alquilerService.getUltimosAlquileres(10);

            // Crea un objeto de respuesta
            var summary = new AdminSummary(totalCoches, totalAlquileres, totalClientes, totalIngresos, ultimosAlquileres);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al generar el resumen administrativo: " + e.getMessage());
        }
    }

    // Clase interna para manejar el resumen administrativo
    static class AdminSummary {
        public int totalCoches;
        public int totalAlquileres;
        public int totalClientes;
        public BigDecimal totalIngresos;
        public List<Alquiler> ultimosAlquileres;

        public AdminSummary(int totalCoches, int totalAlquileres, int totalClientes, BigDecimal totalIngresos, List<Alquiler> ultimosAlquileres) {
            this.totalCoches = totalCoches;
            this.totalAlquileres = totalAlquileres;
            this.totalClientes = totalClientes;
            this.totalIngresos = totalIngresos;
            this.ultimosAlquileres = ultimosAlquileres;
        }
    }
}
