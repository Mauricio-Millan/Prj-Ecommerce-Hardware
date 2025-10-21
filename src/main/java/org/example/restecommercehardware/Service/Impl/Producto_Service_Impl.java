package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.DTOs.ProductoDetalleDTO;
import org.example.restecommercehardware.Mapper.Categoria_Entity;
import org.example.restecommercehardware.Mapper.Marca_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Repository.Categoria_Repository;
import org.example.restecommercehardware.Repository.Marca_Repository;
import org.example.restecommercehardware.Repository.Producto_Repository;
import org.example.restecommercehardware.Service.Producto_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Producto_Service_Impl implements Producto_Service {

    private final Producto_Repository productoRepository;
    private final Categoria_Repository categoriaRepository;
    private final Marca_Repository marcaRepository;

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
        Categoria_Entity categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + idCategoria));
        return productoRepository.findByIdCategoria(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto_Entity> getProductosByMarca(Long idMarca) {
        Marca_Entity marca = marcaRepository.findById(idMarca)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada con id: " + idMarca));
        return productoRepository.findByIdMarca(marca);
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

    @Override
    @Transactional(readOnly = true)
    public List<ProductoDetalleDTO> getProductosConImagenPortada() {
        List<Object[]> resultados = productoRepository.obtenerProductosConImagenPortada();

        return resultados.stream()
                .map(row -> new ProductoDetalleDTO(
                        ((Number) row[0]).longValue(),  // id
                        (String) row[1],                 // nombre
                        (String) row[2],                 // descripcion
                        row[3] != null ? ((Number) row[3]).doubleValue() : null,  // precio
                        row[4] != null ? ((Number) row[4]).intValue() : null,     // stock
                        (String) row[5],                 // sku
                        (String) row[6],                 // imagen_portada
                        row[7] != null ? ((Number) row[7]).longValue() : null,    // id_marca
                        (String) row[8],                 // nombre_marca
                        row[9] != null ? ((Number) row[9]).longValue() : null,    // id_categoria
                        (String) row[10]                 // nombre_categoria
                ))
                .collect(Collectors.toList());
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
//        if (origen.getUrlImagen() != null) {
//            destino.setUrlImagen(origen.getUrlImagen());
//        }
        if (origen.getIdCategoria() != null) {
            destino.setIdCategoria(origen.getIdCategoria());
        }
        if (origen.getIdMarca() != null) {
            destino.setIdMarca(origen.getIdMarca());
        }
    }
}
