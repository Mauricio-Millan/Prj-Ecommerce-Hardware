package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Categoria_Entity;

import java.util.List;
import java.util.Optional;

public interface Categoria_Service {
    List<Categoria_Entity> getAllCategorias();
    Optional<Categoria_Entity> getCategoriaById(Long id);
    Optional<Categoria_Entity> getCategoriaByNombre(String nombre);
    Categoria_Entity createCategoria(Categoria_Entity categoria);
    Categoria_Entity updateCategoria(Long id, Categoria_Entity categoria);
    void deleteCategoria(Long id);
}

