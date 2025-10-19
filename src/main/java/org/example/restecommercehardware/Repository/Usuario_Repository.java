package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Usuario_Repository extends JpaRepository<Usuario_Entity, Long> {
    Optional<Usuario_Entity> findByCorreoElectronico(String correoElectronico);
    boolean existsByCorreoElectronico(String correoElectronico);
}
