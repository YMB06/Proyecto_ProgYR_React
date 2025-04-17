package com.yr.alquilercoches.models.entities;

import java.math.BigDecimal;

public class AlquilerDTO {
    private Long cocheId;           // Changed from nested object to simple ID
    private Long clienteId;         // Added client ID
    private String fecha_inicio;
    private String fecha_fin;
    private BigDecimal precio_total;
    
    // Getters and setters
  
    public Long getCocheId() {
          return cocheId;
     }
    public void setCocheId(Long cocheId) {
          this.cocheId = cocheId;
     }
    public Long getClienteId() {
          return clienteId;
     }
    public void setClienteId(Long clienteId) {
          this.clienteId = clienteId;
     }
    public String getFecha_inicio() {
        return fecha_inicio;
    }
    public void setFecha_inicio(String fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }
    public String getFecha_fin() {
        return fecha_fin;
    }
    public void setFecha_fin(String fecha_fin) {
        this.fecha_fin = fecha_fin;
    }
    public BigDecimal getPrecio_total() {
        return precio_total;
    }
    public void setPrecio_total(BigDecimal precio_total) {
        this.precio_total = precio_total;
    }
    
    
}


