package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yr.alquilercoches.models.entities.Clientes;

@RestController
public class ClienteRestController {

    @GetMapping("/api/cliente/index")
    public ResponseEntity<Clientes> clienteIndex() {
        Clientes cliente = new Clientes();
        return ResponseEntity.ok(cliente);
    }
}
