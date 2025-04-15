package com.yr.alquilercoches.controllers.Admin;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.entities.Coches;
import com.yr.alquilercoches.models.services.AlquilerService;
import com.yr.alquilercoches.models.services.CochesService;

@RestController
@RequestMapping("/api/admin/coches") // Base de la URL para el controlador REST
public class AdminCochesRestController {

    @Autowired
    private CochesService cochesService;

    @Value("${upload.path}")
    private String uploadPath;

    @Autowired
    private AlquilerService alquilerService;

    // GET: Obtener todos los coches
    @GetMapping
    public ResponseEntity<List<Coches>> getAllCoches() {
        List<Coches> coches = cochesService.getAll();
        return ResponseEntity.ok(coches);
    }

    // POST: Crear un coche
    @PostMapping("/crear")
    public ResponseEntity<String> crearCoche(
            @ModelAttribute Coches coche,
            @RequestParam("file") MultipartFile file) {
        try {
            // Maneja la subida de archivos
            if (!file.isEmpty()) {
                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                Path filePath = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                coche.setImagen(filename);
            }

            cochesService.save(coche);
            return ResponseEntity.ok("Coche creado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al crear el coche: " + e.getMessage());
        }
    }

    // GET: Obtener un coche por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCocheById(@PathVariable Long id) {
        try {
            Coches coche = cochesService.getId(id);
            if (coche == null) {
                return ResponseEntity.status(404).body("Coche no encontrado.");
            }
            return ResponseEntity.ok(coche);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al buscar el coche: " + e.getMessage());
        }
    }

    // PUT: Editar un coche por ID
    @PutMapping("/editar/{id}")
    public ResponseEntity<String> editarCoche(
            @PathVariable Long id,
            @ModelAttribute Coches coche,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                Coches existingCoche = cochesService.getId(id);
                if (existingCoche != null && existingCoche.getImagen() != null) {
                    Path oldFile = Paths.get(uploadPath).resolve(existingCoche.getImagen());
                    Files.deleteIfExists(oldFile);
                }

                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                Path filePath = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                coche.setImagen(filename);
            } else {
                Coches existingCoche = cochesService.getId(id);
                if (existingCoche != null) {
                    coche.setImagen(existingCoche.getImagen());
                }
            }

            coche.setId(id);
            cochesService.update(coche);
            return ResponseEntity.ok("Coche actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al actualizar el coche: " + e.getMessage());
        }
    }

    // DELETE: Eliminar un coche por ID
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<String> borrarCoche(@PathVariable Long id) {
        try {
            Coches coche = cochesService.getId(id);
            if (coche != null) {
                List<Alquiler> alquileresAsociados = alquilerService.findByCocheId(id);
                for (Alquiler alquiler : alquileresAsociados) {
                    alquilerService.deleteById(alquiler.getId());
                }

                cochesService.deleteById(id);
                return ResponseEntity.ok("Coche y sus alquileres asociados eliminados exitosamente.");
            } else {
                return ResponseEntity.status(404).body("Coche no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al eliminar el coche: " + e.getMessage());
        }
    }
}
