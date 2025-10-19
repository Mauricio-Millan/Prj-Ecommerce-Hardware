package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.ItemsPedido_Entity;
import org.example.restecommercehardware.Repository.ItemsPedido_Repository;
import org.example.restecommercehardware.Service.ItemsPedido_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemsPedido_Service_Impl implements ItemsPedido_Service {

    private final ItemsPedido_Repository itemsPedidoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemsPedido_Entity> getAllItemsPedido() {
        return itemsPedidoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ItemsPedido_Entity> getItemPedidoById(Long id) {
        return itemsPedidoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemsPedido_Entity> getItemsByPedido(Long idPedido) {
        return itemsPedidoRepository.findByIdPedido(idPedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemsPedido_Entity> getItemsByProducto(Long idProducto) {
        return itemsPedidoRepository.findByIdProducto(idProducto);
    }

    @Override
    @Transactional
    public ItemsPedido_Entity createItemPedido(ItemsPedido_Entity itemPedido) {
        return itemsPedidoRepository.save(itemPedido);
    }

    @Override
    @Transactional
    public ItemsPedido_Entity updateItemPedido(Long id, ItemsPedido_Entity itemActualizado) {
        ItemsPedido_Entity item = itemsPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de pedido no encontrado con id: " + id));

        actualizarCampos(item, itemActualizado);
        return itemsPedidoRepository.save(item);
    }

    @Override
    @Transactional
    public void deleteItemPedido(Long id) {
        if (!itemsPedidoRepository.existsById(id)) {
            throw new RuntimeException("Item de pedido no encontrado con id: " + id);
        }
        itemsPedidoRepository.deleteById(id);
    }

    private void actualizarCampos(ItemsPedido_Entity destino, ItemsPedido_Entity origen) {
        if (origen.getIdPedido() != null) {
            destino.setIdPedido(origen.getIdPedido());
        }
        if (origen.getIdProducto() != null) {
            destino.setIdProducto(origen.getIdProducto());
        }
        if (origen.getCantidad() != null) {
            destino.setCantidad(origen.getCantidad());
        }
        if (origen.getPrecioUnitario() != null) {
            destino.setPrecioUnitario(origen.getPrecioUnitario());
        }
    }
}

