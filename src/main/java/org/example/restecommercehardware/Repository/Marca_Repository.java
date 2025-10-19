package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Marca_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Marca_Repository extends JpaRepository<Marca_Entity, Long> {
    Optional<Marca_Entity> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}
