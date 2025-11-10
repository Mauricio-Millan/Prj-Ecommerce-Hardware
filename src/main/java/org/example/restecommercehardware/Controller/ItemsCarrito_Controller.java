package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.DTOs.ItemCarritoConImagenDTO;
import org.example.restecommercehardware.Mapper.ItemsCarrito_Entity;
import org.example.restecommercehardware.Service.ItemsCarrito_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items-carrito")
@RequiredArgsConstructor
public class ItemsCarrito_Controller {

    private final ItemsCarrito_Service itemsCarritoService;

    @GetMapping
    public ResponseEntity<List<ItemsCarrito_Entity>> getAllItemsCarrito() {
        List<ItemsCarrito_Entity> items = itemsCarritoService.getAllItemsCarrito();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemsCarrito_Entity> getItemCarritoById(@PathVariable Long id) {
        return itemsCarritoService.getItemCarritoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/carrito/{idCarrito}")
    public ResponseEntity<List<ItemCarritoConImagenDTO>> getItemsByCarrito(@PathVariable Long idCarrito) {
        List<ItemCarritoConImagenDTO> items = itemsCarritoService.getItemsByCarritoConImagen(idCarrito);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<ItemsCarrito_Entity>> getItemsByProducto(@PathVariable Long idProducto) {
        List<ItemsCarrito_Entity> items = itemsCarritoService.getItemsByProducto(idProducto);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ItemsCarrito_Entity> createItemCarrito(@RequestBody ItemsCarrito_Entity itemCarrito) {
        try {
            ItemsCarrito_Entity nuevoItem = itemsCarritoService.createItemCarrito(itemCarrito);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemsCarrito_Entity> updateItemCarrito(
            @PathVariable Long id,
            @RequestBody ItemsCarrito_Entity itemCarrito) {
        try {
            ItemsCarrito_Entity itemActualizado = itemsCarritoService.updateItemCarrito(id, itemCarrito);
            return ResponseEntity.ok(itemActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemCarrito(@PathVariable Long id) {
        try {
            itemsCarritoService.deleteItemCarrito(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


