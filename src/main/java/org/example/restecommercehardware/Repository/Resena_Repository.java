package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Mapper.Resena_Entity;
import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Resena_Repository extends JpaRepository<Resena_Entity, Long> {
    List<Resena_Entity> findByIdProducto(Producto_Entity producto);
    List<Resena_Entity> findByIdUsuario(Usuario_Entity usuario);
    List<Resena_Entity> findByCalificacion(Integer calificacion);
}