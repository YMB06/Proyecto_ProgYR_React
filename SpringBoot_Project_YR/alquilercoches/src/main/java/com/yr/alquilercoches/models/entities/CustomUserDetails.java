package com.yr.alquilercoches.models.entities;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {
    private final Clientes cliente;

    public CustomUserDetails(Clientes cliente) {
        this.cliente = cliente;
    }
    
  public Clientes getCliente() {
    return this.cliente;
}

    // este metodo es para obtener los roles del usuario
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = cliente.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return cliente.getPassword();
    }

    @Override
    public String getUsername() {
        return cliente.getUsername();
    }

}