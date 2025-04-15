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

    // POST: Crear un cliente
    @PostMapping("/crear")
    public ResponseEntity<String> crearCliente(@RequestBody Clientes cliente) {
        try {
            cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
            clienteService.save(cliente);
            return ResponseEntity.ok("Cliente creado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al crear el cliente: " + e.getMessage());
        }
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

    // PUT: Editar un cliente por ID
    @PutMapping("/editar/{id}")
    public ResponseEntity<String> editarCliente(@PathVariable Long id, @RequestBody Clientes cliente) {
        try {
            Clientes existingCliente = clienteService.getId(id);
            cliente.setId(id);

            // Mantiene la contraseña existente si no se proporciona una nueva
            if (cliente.getPassword() == null || cliente.getPassword().isEmpty()) {
                cliente.setPassword(existingCliente.getPassword());
            } else {
                cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
            }

            clienteService.update(cliente);
            return ResponseEntity.ok("Cliente actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al actualizar el cliente: " + e.getMessage());
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
