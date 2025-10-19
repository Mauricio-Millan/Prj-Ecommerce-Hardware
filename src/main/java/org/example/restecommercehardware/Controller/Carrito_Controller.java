package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Carrito_Entity;
import org.example.restecommercehardware.Service.Carrito_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carritos")
@RequiredArgsConstructor
public class Carrito_Controller {

    private final Carrito_Service carritoService;

    @GetMapping
    public ResponseEntity<List<Carrito_Entity>> getAllCarritos() {
        List<Carrito_Entity> carritos = carritoService.getAllCarritos();
        return ResponseEntity.ok(carritos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrito_Entity> getCarritoById(@PathVariable Long id) {
        return carritoService.getCarritoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Carrito_Entity> getCarritoByUsuario(@PathVariable Long idUsuario) {
        return carritoService.getCarritoByUsuario(idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Carrito_Entity> createCarrito(@RequestBody Carrito_Entity carrito) {
        try {
            Carrito_Entity nuevoCarrito = carritoService.createCarrito(carrito);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCarrito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carrito_Entity> updateCarrito(
            @PathVariable Long id,
            @RequestBody Carrito_Entity carrito) {
        try {
            Carrito_Entity carritoActualizado = carritoService.updateCarrito(id, carrito);
            return ResponseEntity.ok(carritoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarrito(@PathVariable Long id) {
        try {
            carritoService.deleteCarrito(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

