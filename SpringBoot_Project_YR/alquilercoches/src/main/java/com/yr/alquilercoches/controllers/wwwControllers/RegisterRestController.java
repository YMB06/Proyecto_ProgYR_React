package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.ClienteRegistroDTO;
import com.yr.alquilercoches.models.entities.Clientes;
import com.yr.alquilercoches.models.services.ClienteService;

@RestController
@RequestMapping("/api/register") // Base de URL REST
public class RegisterRestController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // POST: Registrar un cliente
    @PostMapping
    public ResponseEntity<String> registrarCliente(@RequestBody ClienteRegistroDTO dto) {
        try {
            Clientes cliente = new Clientes();
            cliente.setNombre(dto.getNombre());
            cliente.setApellidos(dto.getApellidos());
            cliente.setUsername(dto.getUsername());
            cliente.setEmail(dto.getEmail());
            cliente.setTelefono(dto.getTelefono());
            cliente.setDni(dto.getDni());
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            cliente.setPassword(encodedPassword);
            cliente.setRole("ROLE_USER");
    
            clienteService.save(cliente);
            return ResponseEntity.ok("Cliente registrado exitosamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al registrar el cliente: " + e.getMessage());
        }
    }
    
    // GET: Mostrar el formulario de registro (ejemplo adaptado)
    @GetMapping
    public ResponseEntity<String> showRegistrationInfo() {
        return ResponseEntity.ok("Endpoint para registrar nuevos clientes.");
    }
}
