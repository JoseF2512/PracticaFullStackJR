// Entidad JPA
package com.productos.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
//La tabla se llamará productos
@Table(name = "productos", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nombre")
})
//Indica que la columna nombre debe ser única (no pueden existir dos productos con el mismo nombre).
public class Producto {

    //autoincremental en MySQL.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //No puede ser null, ni vacío, ni solo espacios.
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    private String marca;

    private String categoria;

    @Positive(message = "El precio debe ser mayor que 0")
    private Double precio;

    @Min(value = 0, message = "Las existencias deben ser mayor o igual a 0")
    private Integer existencias;

    private Boolean activo;


    public Producto() {}

    // Constructor con todos los campos excepto id
    public Producto(String nombre, String marca, String categoria, Double precio, Integer existencias, Boolean activo) {
        this.nombre = nombre;
        this.marca = marca;
        this.categoria = categoria;
        this.precio = precio;
        this.existencias = existencias;
        this.activo = activo;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getExistencias() { return existencias; }
    public void setExistencias(Integer existencias) { this.existencias = existencias; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
