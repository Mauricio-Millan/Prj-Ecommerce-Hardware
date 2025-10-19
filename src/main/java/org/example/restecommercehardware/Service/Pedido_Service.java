package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Pedido_Entity;

import java.util.List;
import java.util.Optional;

public interface Pedido_Service {
    List<Pedido_Entity> getAllPedidos();
    Optional<Pedido_Entity> getPedidoById(Long id);
    List<Pedido_Entity> getPedidosByUsuario(Long idUsuario);
    List<Pedido_Entity> getPedidosByEstado(String estado);
    Pedido_Entity createPedido(Pedido_Entity pedido);
    Pedido_Entity updatePedido(Long id, Pedido_Entity pedido);
    void deletePedido(Long id);
}

