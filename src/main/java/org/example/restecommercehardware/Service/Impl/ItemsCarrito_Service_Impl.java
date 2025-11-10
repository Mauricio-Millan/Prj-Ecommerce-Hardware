package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.DTOs.ItemCarritoConImagenDTO;
import org.example.restecommercehardware.Mapper.Carrito_Entity;
import org.example.restecommercehardware.Mapper.ItemsCarrito_Entity;
import org.example.restecommercehardware.Mapper.ProductoImg_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Repository.Carrito_Repository;
import org.example.restecommercehardware.Repository.ItemsCarrito_Repository;
import org.example.restecommercehardware.Repository.ProductoImg_Repository;
import org.example.restecommercehardware.Repository.Producto_Repository;
import org.example.restecommercehardware.Service.ItemsCarrito_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemsCarrito_Service_Impl implements ItemsCarrito_Service {

    private final ItemsCarrito_Repository itemsCarritoRepository;
    private final Carrito_Repository carritoRepository;
    private final Producto_Repository productoRepository;
    private final ProductoImg_Repository productoImgRepository;

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
        Carrito_Entity carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));
        return itemsCarritoRepository.findByIdCarrito(carrito);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemsCarrito_Entity> getItemsByProducto(Long idProducto) {
        Producto_Entity producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + idProducto));
        return itemsCarritoRepository.findByIdProducto(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemCarritoConImagenDTO> getItemsByCarritoConImagen(Long idCarrito) {
        Carrito_Entity carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        List<ItemsCarrito_Entity> items = itemsCarritoRepository.findByIdCarrito(carrito);

        return items.stream().map(item -> {
            ItemCarritoConImagenDTO dto = new ItemCarritoConImagenDTO();
            Producto_Entity producto = item.getIdProducto();

            // Datos del item
            dto.setId(item.getId());
            dto.setIdCarrito(carrito.getId());
            dto.setCantidad(item.getCantidad());

            // Datos del producto
            dto.setIdProducto(producto.getId());
            dto.setNombreProducto(producto.getNombre());
            dto.setDescripcionProducto(producto.getDescripcion());
            dto.setPrecioProducto(producto.getPrecio());
            dto.setStockProducto(producto.getStock());
            dto.setSkuProducto(producto.getSku());

            // Calcular subtotal
            BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(item.getCantidad()));
            dto.setSubtotal(subtotal);

            // Obtener imagen de portada (orden = 1)
            List<ProductoImg_Entity> imagenes = productoImgRepository.findByIdProductoOrderByOrdenAsc(producto);
            if (!imagenes.isEmpty()) {
                dto.setImagenPortada(imagenes.get(0).getUrlImagen());
            } else {
                dto.setImagenPortada(null);
            }

            return dto;
        }).collect(Collectors.toList());
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
