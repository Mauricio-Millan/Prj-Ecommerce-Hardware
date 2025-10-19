package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.Pedido_Entity;
import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Pedido_Repository extends JpaRepository<Pedido_Entity, Long> {
    List<Pedido_Entity> findByIdUsuario(Usuario_Entity usuario);
    List<Pedido_Entity> findByEstado(String estado);
}