package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.ItemsPedido_Entity;
import org.example.restecommercehardware.Service.ItemsPedido_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items-pedido")
@RequiredArgsConstructor
public class ItemsPedido_Controller {

    private final ItemsPedido_Service itemsPedidoService;

    @GetMapping
    public ResponseEntity<List<ItemsPedido_Entity>> getAllItemsPedido() {
        List<ItemsPedido_Entity> items = itemsPedidoService.getAllItemsPedido();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemsPedido_Entity> getItemPedidoById(@PathVariable Long id) {
        return itemsPedidoService.getItemPedidoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<List<ItemsPedido_Entity>> getItemsByPedido(@PathVariable Long idPedido) {
        List<ItemsPedido_Entity> items = itemsPedidoService.getItemsByPedido(idPedido);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<ItemsPedido_Entity>> getItemsByProducto(@PathVariable Long idProducto) {
        List<ItemsPedido_Entity> items = itemsPedidoService.getItemsByProducto(idProducto);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ItemsPedido_Entity> createItemPedido(@RequestBody ItemsPedido_Entity itemPedido) {
        try {
            ItemsPedido_Entity nuevoItem = itemsPedidoService.createItemPedido(itemPedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemsPedido_Entity> updateItemPedido(
            @PathVariable Long id,
            @RequestBody ItemsPedido_Entity itemPedido) {
        try {
            ItemsPedido_Entity itemActualizado = itemsPedidoService.updateItemPedido(id, itemPedido);
            return ResponseEntity.ok(itemActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemPedido(@PathVariable Long id) {
        try {
            itemsPedidoService.deleteItemPedido(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


