package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.ProductoImg_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoImg_Repository extends JpaRepository<ProductoImg_Entity, Long> {
    List<ProductoImg_Entity> findByIdProducto(Producto_Entity producto);
    List<ProductoImg_Entity> findByIdProductoOrderByOrdenAsc(Producto_Entity producto);
}
