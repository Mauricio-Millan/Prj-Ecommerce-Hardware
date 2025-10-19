package org.example.restecommercehardware.Repository;

import org.example.restecommercehardware.Mapper.ItemsPedido_Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsPedido_Repository extends JpaRepository<ItemsPedido_Entity, Long> {
    List<ItemsPedido_Entity> findByIdPedido(Long idPedido);
    List<ItemsPedido_Entity> findByIdProducto(Long idProducto);
}