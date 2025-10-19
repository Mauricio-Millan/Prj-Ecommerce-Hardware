package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Carrito_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Carrito_Repository extends JpaRepository<Carrito_Entity, Long> {
    Optional<Carrito_Entity> findByIdUsuario(Long idUsuario);
}
