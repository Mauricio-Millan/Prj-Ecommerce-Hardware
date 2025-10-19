package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.ItemsCarrito_Entity;

import java.util.List;
import java.util.Optional;

public interface ItemsCarrito_Service {
    List<ItemsCarrito_Entity> getAllItemsCarrito();
    Optional<ItemsCarrito_Entity> getItemCarritoById(Long id);
    List<ItemsCarrito_Entity> getItemsByCarrito(Long idCarrito);
    List<ItemsCarrito_Entity> getItemsByProducto(Long idProducto);
    ItemsCarrito_Entity createItemCarrito(ItemsCarrito_Entity itemCarrito);
    ItemsCarrito_Entity updateItemCarrito(Long id, ItemsCarrito_Entity itemCarrito);
    void deleteItemCarrito(Long id);
}

