package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Repository.Producto_Repository;
import org.example.restecommercehardware.Service.Producto_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Producto_Service_Impl implements Producto_Service {

    private final Producto_Repository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Producto_Entity> getAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto_Entity> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto_Entity> getProductoBySku(String sku) {
        return productoRepository.findBySku(sku);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto_Entity> getProductosByCategoria(Long idCategoria) {
        return productoRepository.findByIdCategoria(idCategoria);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto_Entity> getProductosByMarca(Long idMarca) {
        return productoRepository.findByIdMarca(idMarca);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto_Entity> searchProductosByNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    @Transactional
    public Producto_Entity createProducto(Producto_Entity producto) {
        if (producto.getSku() != null) {
            validarSkuUnico(producto.getSku());
        }
        producto.setCreadoEn(Instant.now());
        producto.setActualizadoEn(Instant.now());
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto_Entity updateProducto(Long id, Producto_Entity productoActualizado) {
        Producto_Entity producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        if (productoActualizado.getSku() != null &&
            !producto.getSku().equals(productoActualizado.getSku())) {
            validarSkuUnico(productoActualizado.getSku());
        }

        actualizarCampos(producto, productoActualizado);
        producto.setActualizadoEn(Instant.now());
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public void deleteProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    private void validarSkuUnico(String sku) {
        if (productoRepository.existsBySku(sku)) {
            throw new RuntimeException("Ya existe un producto con el SKU: " + sku);
        }
    }

    private void actualizarCampos(Producto_Entity destino, Producto_Entity origen) {
        if (origen.getNombre() != null) {
            destino.setNombre(origen.getNombre());
        }
        if (origen.getDescripcion() != null) {
            destino.setDescripcion(origen.getDescripcion());
        }
        if (origen.getPrecio() != null) {
            destino.setPrecio(origen.getPrecio());
        }
        if (origen.getStock() != null) {
            destino.setStock(origen.getStock());
        }
        if (origen.getSku() != null) {
            destino.setSku(origen.getSku());
        }
        if (origen.getUrlImagen() != null) {
            destino.setUrlImagen(origen.getUrlImagen());
        }
        if (origen.getIdCategoria() != null) {
            destino.setIdCategoria(origen.getIdCategoria());
        }
        if (origen.getIdMarca() != null) {
            destino.setIdMarca(origen.getIdMarca());
        }
    }
}

