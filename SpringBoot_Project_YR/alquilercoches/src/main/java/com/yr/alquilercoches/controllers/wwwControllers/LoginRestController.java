package com.yr.alquilercoches.controllers.wwwControllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginRestController {

    @GetMapping("/api/login")
    public String showLoginMessage(
        @RequestParam(required = false) String error, 
        @RequestParam(required = false) String logout
    ) {
        if (error != null) {
            return "{\"message\": \"Invalid username or password.\"}";
        }

        if (logout != null) {
            return "{\"message\": \"You have been logged out successfully.\"}";
        }

        return "{\"message\": \"Login endpoint reached.\"}";
    }
}
