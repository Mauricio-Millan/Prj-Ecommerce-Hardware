package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Resena_Entity;

import java.util.List;
import java.util.Optional;

public interface Resena_Service {
    List<Resena_Entity> getAllResenas();
    Optional<Resena_Entity> getResenaById(Long id);
    List<Resena_Entity> getResenasByProducto(Long idProducto);
    List<Resena_Entity> getResenasByUsuario(Long idUsuario);
    List<Resena_Entity> getResenasByCalificacion(Integer calificacion);
    Resena_Entity createResena(Resena_Entity resena);
    Resena_Entity updateResena(Long id, Resena_Entity resena);
    void deleteResena(Long id);
}

