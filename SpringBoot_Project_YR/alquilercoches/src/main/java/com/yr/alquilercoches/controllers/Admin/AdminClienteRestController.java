package com.yr.alquilercoches.controllers.Admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Alquiler;
import com.yr.alquilercoches.models.entities.Clientes;
import com.yr.alquilercoches.models.services.AlquilerService;
import com.yr.alquilercoches.models.services.ClienteService;

@RestController
@RequestMapping("/api/admin/clientes") // Base de la ruta REST
public class AdminClienteRestController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AlquilerService alquilerService;

    // GET: Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<Clientes>> getAllClientes() {
        List<Clientes> clientes = clienteService.getAll();
        return ResponseEntity.ok(clientes);
    }



    // GET: Obtener un cliente por ID para editar
    @GetMapping("/{id}")
    public ResponseEntity<?> getClienteById(@PathVariable Long id) {
        try {
            Clientes cliente = clienteService.getId(id);
            if (cliente == null) {
                return ResponseEntity.status(404).body("Cliente no encontrado.");
            }
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al buscar el cliente: " + e.getMessage());
        }
    }

    @PostMapping("/crear")
public ResponseEntity<?> crearCliente(@RequestBody Clientes cliente) {
    try {
        // Detailed logging of received data
        System.out.println("=== Received Client Data ===");
        System.out.println("Nombre: " + cliente.getNombre());
        System.out.println("Apellidos: " + cliente.getApellidos());
        System.out.println("Username: " + cliente.getUsername());
        System.out.println("Email: " + cliente.getEmail());
        System.out.println("Telefono: " + cliente.getTelefono());
        System.out.println("DNI: " + cliente.getDni());
        System.out.println("Role: " + cliente.getRole());
        System.out.println("Password present: " + (cliente.getPassword() != null && !cliente.getPassword().isEmpty()));
        
        // Field by field validation with specific error messages
        if (cliente.getNombre() == null || cliente.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre es obligatorio");
        }
        if (cliente.getApellidos() == null || cliente.getApellidos().isEmpty()) {
            return ResponseEntity.badRequest().body("Los apellidos son obligatorios");
        }
        if (cliente.getUsername() == null || cliente.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre de usuario es obligatorio");
        }
        if (cliente.getPassword() == null || cliente.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La contraseña es obligatoria");
        }
        if (cliente.getEmail() == null || cliente.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("El email es obligatorio");
        }
        if (cliente.getTelefono() == null || cliente.getTelefono().isEmpty()) {
            return ResponseEntity.badRequest().body("El teléfono es obligatorio");
        }
        if (cliente.getDni() == null || cliente.getDni().isEmpty()) {
            return ResponseEntity.badRequest().body("El DNI es obligatorio");
        }

        // Validate DNI format
        if (!cliente.getDni().matches("[0-9]{8}[A-Za-z]")) {
            return ResponseEntity.badRequest().body("El formato del DNI es inválido");
        }

        // Check if username already exists
        if (clienteService.findByUsername(cliente.getUsername()) != null) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }

        try {
            // Encode password
            String encodedPassword = passwordEncoder.encode(cliente.getPassword());
            cliente.setPassword(encodedPassword);
        } catch (Exception e) {
            System.out.println("Error encoding password: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error al procesar la contraseña");
        }

        // Ensure role has ROLE_ prefix
        if (!cliente.getRole().startsWith("ROLE_")) {
            cliente.setRole("ROLE_" + cliente.getRole());
        }

        // Save client
        try {
            Clientes savedCliente = clienteService.save(cliente);
            System.out.println("Cliente saved successfully with ID: " + savedCliente.getId());
            return ResponseEntity.ok().body(savedCliente);
        } catch (Exception e) {
            System.out.println("Error saving client: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al guardar el cliente en la base de datos");
        }

    } catch (Exception e) {
        System.out.println("Unexpected error: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error inesperado: " + e.getMessage());
    }
}

    @PutMapping("/editar/{id}")
    public ResponseEntity<String> editarCliente(@PathVariable Long id, @RequestBody Clientes cliente) {
        try {
            Clientes existingCliente = clienteService.getId(id);
            if (existingCliente == null) {
                return ResponseEntity.status(404).body("Cliente no encontrado");
            }

            cliente.setId(id);
            
            // Only update password if provided
            if (cliente.getPassword() != null && !cliente.getPassword().isEmpty()) {
                cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
            } else {
                cliente.setPassword(existingCliente.getPassword());
            }

            clienteService.update(cliente);
            return ResponseEntity.ok("Cliente actualizado exitosamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al actualizar el cliente: " + e.getMessage());
        }
    }

    // DELETE: Eliminar un cliente por ID
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<String> borrarCliente(@PathVariable Long id) {
        try {
            Clientes cliente = clienteService.getId(id);
            if (cliente != null) {
                // Elimina los alquileres asociados
                List<Alquiler> alquileresAsociados = alquilerService.findByClienteId(id);
                for (Alquiler alquiler : alquileresAsociados) {
                    alquilerService.deleteById(alquiler.getId());
                }

                // Elimina al cliente
                clienteService.deleteById(id);
                return ResponseEntity.ok("Cliente y sus alquileres asociados eliminados exitosamente.");
            } else {
                return ResponseEntity.status(404).body("Cliente no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al eliminar el cliente: " + e.getMessage());
        }
    }
}
