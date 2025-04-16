package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ImageController {

    private final String uploadDir = "src/main/resources/static/uploads/";

    @GetMapping("/uploads/coches/{filename}")
    public Resource getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            return new UrlResource(filePath.toUri());
        } catch (Exception e) {
            throw new RuntimeException("Error al cargar la imagen: " + filename, e);
        }
    }
}

