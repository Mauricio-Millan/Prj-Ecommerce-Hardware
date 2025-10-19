package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Marca_Entity;

import java.util.List;
import java.util.Optional;

public interface Marca_Service {
    List<Marca_Entity> getAllMarcas();
    Optional<Marca_Entity> getMarcaById(Long id);
    Optional<Marca_Entity> getMarcaByNombre(String nombre);
    Marca_Entity createMarca(Marca_Entity marca);
    Marca_Entity updateMarca(Long id, Marca_Entity marca);
    void deleteMarca(Long id);
}

