package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login") // Base de URL REST para autenticación
public class LoginRestController {

    @GetMapping
    public ResponseEntity<?> showLoginForm(
            @RequestParam(required = false) String error,
            @RequestParam(required = false) String logout) {

        // Crear un objeto de respuesta
        LoginResponse response = new LoginResponse();

        if (error != null) {
            response.setError("Invalid username or password.");
        }

        if (logout != null) {
            response.setMessage("You have been logged out successfully.");
        }

        return ResponseEntity.ok(response);
    }

    // Clase interna para manejar la estructura de la respuesta JSON
    static class LoginResponse {
        private String error;
        private String message;

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
