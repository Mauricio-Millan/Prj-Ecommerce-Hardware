package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.ItemsPedido_Entity;

import java.util.List;
import java.util.Optional;

public interface ItemsPedido_Service {
    List<ItemsPedido_Entity> getAllItemsPedido();
    Optional<ItemsPedido_Entity> getItemPedidoById(Long id);
    List<ItemsPedido_Entity> getItemsByPedido(Long idPedido);
    List<ItemsPedido_Entity> getItemsByProducto(Long idProducto);
    ItemsPedido_Entity createItemPedido(ItemsPedido_Entity itemPedido);
    ItemsPedido_Entity updateItemPedido(Long id, ItemsPedido_Entity itemPedido);
    void deleteItemPedido(Long id);
}

