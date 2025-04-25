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
@RequestMapping("/api/admin/coches") 
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

    @PostMapping("/crear")
    public ResponseEntity<?> crearCoche(@ModelAttribute Coches coche, 
                                      @RequestParam("file") MultipartFile file) {
        try {
            if (!file.isEmpty()) {
                // le da un UUID al nombre del archivo
                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Guarda el archivo en el directorio de subida
                Path filePath = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                coche.setImagen(filename);
            }
            
            Coches savedCoche = cochesService.save(coche);
            return ResponseEntity.ok(savedCoche);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body("Error al crear el coche: " + e.getMessage());
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarCoche(@PathVariable Long id,
                                       @ModelAttribute Coches coche,
                                       @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Coches existingCoche = cochesService.getId(id);
            if (existingCoche == null) {
                return ResponseEntity.status(404).body("Coche no encontrado");
            }

            if (file != null && !file.isEmpty()) {
                // Delete old image if exists
                if (existingCoche.getImagen() != null) {
                    Path oldFile = Paths.get(uploadPath).resolve(existingCoche.getImagen());
                    Files.deleteIfExists(oldFile);
                }

                // Save new image
                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadPath).resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                coche.setImagen(filename);
            } else {
                coche.setImagen(existingCoche.getImagen());
            }

            coche.setId(id);
            Coches updatedCoche = cochesService.update(coche);
            return ResponseEntity.ok(updatedCoche);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body("Error al actualizar el coche: " + e.getMessage());
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
