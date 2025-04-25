package com.yr.alquilercoches.controllers.wwwControllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Coches;
import com.yr.alquilercoches.models.services.CochesService;

@RestController
@RequestMapping("/api/coches") 
@CrossOrigin(origins = "http://localhost:5173")
public class CochesRestController {
    @Autowired
    private CochesService cochesService;

    @GetMapping
    public ResponseEntity<List<Coches>> getAllCars() {
        return ResponseEntity.ok(cochesService.getAll());
    }

    // este es el mappping para la imagen
@GetMapping("/api/coches/imagen/{filename}")
public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
    Path imagePath = Paths.get("uploads/coches").resolve(filename);
    Resource resource = new UrlResource(imagePath.toUri());
    
    if (resource.exists() && resource.isReadable()) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(imagePath))
            .body(resource);
    }
    
    return ResponseEntity.notFound().build();
}
    @GetMapping("/{id}") 
    public ResponseEntity<Coches> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(cochesService.getId(id));
    }
}
