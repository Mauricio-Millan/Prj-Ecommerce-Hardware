package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.ItemsCarrito_Entity;
import org.example.restecommercehardware.Repository.ItemsCarrito_Repository;
import org.example.restecommercehardware.Service.ItemsCarrito_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemsCarrito_Service_Impl implements ItemsCarrito_Service {

    private final ItemsCarrito_Repository itemsCarritoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemsCarrito_Entity> getAllItemsCarrito() {
        return itemsCarritoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ItemsCarrito_Entity> getItemCarritoById(Long id) {
        return itemsCarritoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemsCarrito_Entity> getItemsByCarrito(Long idCarrito) {
        return itemsCarritoRepository.findByIdCarrito(idCarrito);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemsCarrito_Entity> getItemsByProducto(Long idProducto) {
        return itemsCarritoRepository.findByIdProducto(idProducto);
    }

    @Override
    @Transactional
    public ItemsCarrito_Entity createItemCarrito(ItemsCarrito_Entity itemCarrito) {
        if (itemCarrito.getCantidad() == null || itemCarrito.getCantidad() < 1) {
            itemCarrito.setCantidad(1);
        }
        return itemsCarritoRepository.save(itemCarrito);
    }

    @Override
    @Transactional
    public ItemsCarrito_Entity updateItemCarrito(Long id, ItemsCarrito_Entity itemActualizado) {
        ItemsCarrito_Entity item = itemsCarritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de carrito no encontrado con id: " + id));

        actualizarCampos(item, itemActualizado);
        return itemsCarritoRepository.save(item);
    }

    @Override
    @Transactional
    public void deleteItemCarrito(Long id) {
        if (!itemsCarritoRepository.existsById(id)) {
            throw new RuntimeException("Item de carrito no encontrado con id: " + id);
        }
        itemsCarritoRepository.deleteById(id);
    }

    private void actualizarCampos(ItemsCarrito_Entity destino, ItemsCarrito_Entity origen) {
        if (origen.getIdCarrito() != null) {
            destino.setIdCarrito(origen.getIdCarrito());
        }
        if (origen.getIdProducto() != null) {
            destino.setIdProducto(origen.getIdProducto());
        }
        if (origen.getCantidad() != null) {
            destino.setCantidad(origen.getCantidad());
        }
    }
}

