package com.productos.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.productos.demo.Producto;
import com.productos.demo.ProductoService;

import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // GET /productos: listar con paginación
    @GetMapping
    public Page<Producto> listarProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        // Convertimos la lista completa a Page (para simplicidad)
        return new org.springframework.data.domain.PageImpl<>(productoService.listarProductos(), pageable, productoService.listarProductos().size());
    }

    // POST /productos: crear nuevo producto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto creado = productoService.crearProducto(producto);
        return ResponseEntity.ok(creado);
    }

    // GET /productos/{id}: obtener detalle
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProducto(id);
        return producto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /productos/{id}: actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto actualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(actualizado);
    }

    // PATCH /productos/{id}/activar: activar o desactivar
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Producto> activarDesactivar(@PathVariable Long id) {
        Producto producto = productoService.obtenerProducto(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        producto.setActivo(!Boolean.TRUE.equals(producto.getActivo()));
        Producto actualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(actualizado);
    }

    // POST /productos/{id}/ajustar: ajustar inventario
    @PostMapping("/{id}/ajustar")
    public ResponseEntity<Producto> ajustarInventario(@PathVariable Long id, @RequestParam int cantidad) {
        Producto producto = productoService.obtenerProducto(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        int nuevasExistencias = producto.getExistencias() + cantidad;
        if (nuevasExistencias < 0) {
            throw new IllegalArgumentException("No se puede tener existencias negativas");
        }
        producto.setExistencias(nuevasExistencias);
        Producto actualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(actualizado);
    }
}
