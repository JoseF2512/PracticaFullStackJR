package com.productos.demo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Crear producto
    public Producto crearProducto(Producto producto) {
        if (productoRepository.existsByNombre(producto.getNombre())) {
            throw new IllegalArgumentException("Ya existe un producto con este nombre");
        }
        if (producto.getPrecio() == null || producto.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor que 0");
        }
        if (producto.getExistencias() == null || producto.getExistencias() < 0) {
            throw new IllegalArgumentException("Las existencias deben ser mayor o igual a 0");
        }
        if (producto.getActivo() == null) {
            producto.setActivo(true); // Por defecto activo
        }
        return productoRepository.save(producto);
    }

    // Obtener todos los productos
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // Obtener producto por id
    public Optional<Producto> obtenerProducto(Long id) {
        return productoRepository.findById(id);
    }

    // Actualizar producto
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        // Validaciones
        if (!productoExistente.getNombre().equals(productoActualizado.getNombre())
                && productoRepository.existsByNombre(productoActualizado.getNombre())) {
            throw new IllegalArgumentException("Ya existe un producto con este nombre");
        }
        if (productoActualizado.getPrecio() == null || productoActualizado.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor que 0");
        }
        if (productoActualizado.getExistencias() == null || productoActualizado.getExistencias() < 0) {
            throw new IllegalArgumentException("Las existencias deben ser mayor o igual a 0");
        }

        // Actualizar campos
        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setMarca(productoActualizado.getMarca());
        productoExistente.setCategoria(productoActualizado.getCategoria());
        productoExistente.setPrecio(productoActualizado.getPrecio());
        productoExistente.setExistencias(productoActualizado.getExistencias());
        productoExistente.setActivo(productoActualizado.getActivo());

        return productoRepository.save(productoExistente);
    }

    // Eliminar producto
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new IllegalArgumentException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }
}
