package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.yr.alquilercoches.models.entities.Clientes;
import com.yr.alquilercoches.models.services.ClienteService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ClienteService clienteService;
@GetMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestParam String username, 
                                           @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Get the client by username
            Clientes cliente = clienteService.findByUsername(username);
            
            if (cliente == null) {
                throw new AuthenticationException("Usuario no encontrado") {};
            }

            LoginResponse response = new LoginResponse();
            response.setSuccess(true);
            response.setRole(cliente.getRole());
            response.setToken("session-" + System.currentTimeMillis()); // Simple session token
            
            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            LoginResponse response = new LoginResponse();
            response.setSuccess(false);
            response.setMessage("Usuario o contraseña incorrectos");
            return ResponseEntity.status(401).body(response);
        }
    }


    static class LoginResponse {
        private boolean success;
        private String token;
        private String role;
        private String message;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}