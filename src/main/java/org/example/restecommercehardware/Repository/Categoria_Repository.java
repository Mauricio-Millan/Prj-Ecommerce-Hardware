package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Categoria_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Categoria_Repository extends JpaRepository<Categoria_Entity, Long> {
    Optional<Categoria_Entity> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}

