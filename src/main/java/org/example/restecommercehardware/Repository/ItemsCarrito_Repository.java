package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Carrito_Entity;
import org.example.restecommercehardware.Mapper.ItemsCarrito_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsCarrito_Repository extends JpaRepository<ItemsCarrito_Entity, Long> {
    List<ItemsCarrito_Entity> findByIdCarrito(Carrito_Entity carrito);
    List<ItemsCarrito_Entity> findByIdProducto(Producto_Entity producto);
}