package com.yr.alquilercoches.models.entities;

public class ClienteRegistroDTO {
    private String nombre;
    private String apellidos;
    private String username;
    private String email;
    private String telefono;
    private String dni;
    private String password;



    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return this.apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDni() {
        return this.dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ClienteRegistroDTO() {
    }

    public ClienteRegistroDTO(String nombre, String apellidos, String username, String email, String telefono, String dni, String password) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.username = username;
        this.email = email;
        this.telefono = telefono;
        this.dni = dni;
        this.password = password;
    }

    @Override
    public String toString() {
        return "ClienteRegistroDTO{" +
                "nombre='" + nombre + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", dni='" + dni + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
    
}

