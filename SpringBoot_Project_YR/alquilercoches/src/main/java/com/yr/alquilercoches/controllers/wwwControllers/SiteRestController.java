package com.yr.alquilercoches.controllers.wwwControllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Coches;
import com.yr.alquilercoches.models.services.CochesService;

@RestController
@RequestMapping("/api/site") // Base de URL REST
public class SiteRestController {

    @Autowired
    private CochesService cochesService;

    // GET: Obtener todos los coches
    @GetMapping
    public ResponseEntity<List<Coches>> getAllCoches() {
        List<Coches> coches = cochesService.getAll();
        return ResponseEntity.ok(coches); // Devuelve la lista de coches en formato JSON
    }
}
