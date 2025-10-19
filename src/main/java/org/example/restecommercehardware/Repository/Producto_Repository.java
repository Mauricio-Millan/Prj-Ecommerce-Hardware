package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Categoria_Entity;
import org.example.restecommercehardware.Mapper.Marca_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Producto_Repository extends JpaRepository<Producto_Entity, Long> {
    Optional<Producto_Entity> findBySku(String sku);
    List<Producto_Entity> findByIdCategoria(Categoria_Entity categoria);
    List<Producto_Entity> findByIdMarca(Marca_Entity marca);
    List<Producto_Entity> findByNombreContainingIgnoreCase(String nombre);
    boolean existsBySku(String sku);
}
