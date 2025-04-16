package com.yr.alquilercoches.controllers.Admin;

import org.springframework.web.bind.annotation.*; // Import necesario para un REST Controller

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.services.AlquilerService;
import com.yr.alquilercoches.models.services.ClienteService;
import com.yr.alquilercoches.models.services.CochesService;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/admin/alquileres") // Base de la ruta para todas las operaciones
public class AdminAlquilerRestController {
    @Autowired
    private AlquilerService alquilerService;

    @Autowired
    private CochesService cochesService;

    @Autowired
    private ClienteService clienteService;

    // GET: Obtener todos los alquileres
    @GetMapping
    public ResponseEntity<List<Alquiler>> getAllAlquileres() {
        List<Alquiler> alquileres = alquilerService.getAll();
        return ResponseEntity.ok(alquileres);
    }

    // POST: Crear un alquiler
    @PostMapping("/crear")
    public ResponseEntity<String> crearAlquiler(@RequestBody Alquiler alquiler) {
        try {
            alquilerService.create(alquiler);
            return ResponseEntity.ok("Alquiler creado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al crear el alquiler: " + e.getMessage());
        }
    }

    // DELETE: Eliminar un alquiler por ID
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarAlquiler(@PathVariable Long id) {
        try {
            alquilerService.deleteById(id);
            return ResponseEntity.ok("Alquiler eliminado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al eliminar el alquiler: " + e.getMessage());
        }
    }

    // GET: Obtener un alquiler por ID para editar
    @GetMapping("/editar/{id}")
    public ResponseEntity<?> getAlquilerById(@PathVariable Long id) {
        try {
            Alquiler alquiler = alquilerService.getId(id);
            return ResponseEntity.ok(alquiler);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Alquiler no encontrado.");
        }
    }

    // PUT: Editar un alquiler por ID
    @PutMapping("/editar/{id}")
    public ResponseEntity<String> editarAlquiler(@PathVariable Long id, @RequestBody Alquiler alquiler) {
        try {
            alquiler.setId(id); // Asegura que se actualice el alquiler correcto
            alquilerService.update(alquiler);
            return ResponseEntity.ok("Alquiler actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al actualizar el alquiler: " + e.getMessage());
        }
    }
}
