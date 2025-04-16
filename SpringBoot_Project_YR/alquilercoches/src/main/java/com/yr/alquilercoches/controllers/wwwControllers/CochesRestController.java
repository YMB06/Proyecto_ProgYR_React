package com.yr.alquilercoches.controllers.wwwControllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Coches;
import com.yr.alquilercoches.models.services.CochesService;

@RestController
@RequestMapping("/api/coches") // Define la base de la URL
@CrossOrigin(origins = "http://localhost:5173") // Permitir acceso desde tu frontend
public class CochesRestController {
    @Autowired
    private CochesService cochesService;

    @GetMapping
    public ResponseEntity<List<Coches>> getAllCars() {
        return ResponseEntity.ok(cochesService.getAll());
    }

    @GetMapping("/{id}") // Remove "api/coches" here to avoid redundancy
    public ResponseEntity<Coches> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(cochesService.getId(id));
    }
}
