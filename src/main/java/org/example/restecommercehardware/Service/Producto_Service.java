package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Producto_Entity;

import java.util.List;
import java.util.Optional;

public interface Producto_Service {
    List<Producto_Entity> getAllProductos();
    Optional<Producto_Entity> getProductoById(Long id);
    Optional<Producto_Entity> getProductoBySku(String sku);
    List<Producto_Entity> getProductosByCategoria(Long idCategoria);
    List<Producto_Entity> getProductosByMarca(Long idMarca);
    List<Producto_Entity> searchProductosByNombre(String nombre);
    Producto_Entity createProducto(Producto_Entity producto);
    Producto_Entity updateProducto(Long id, Producto_Entity producto);
    void deleteProducto(Long id);
}

