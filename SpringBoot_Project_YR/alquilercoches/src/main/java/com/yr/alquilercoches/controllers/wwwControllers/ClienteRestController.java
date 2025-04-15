package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClienteRestController {

    @GetMapping("/api/cliente/index")
    public ResponseEntity<Cliente> clienteIndex() {
        // Crea un cliente como ejemplo
        return ResponseEntity.ok(cliente);
    }
}
