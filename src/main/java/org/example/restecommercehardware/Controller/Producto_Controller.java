package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Service.Producto_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class Producto_Controller {

    private final Producto_Service productoService;

    @GetMapping
    public ResponseEntity<List<Producto_Entity>> getAllProductos() {
        List<Producto_Entity> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto_Entity> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Producto_Entity> getProductoBySku(@PathVariable String sku) {
        return productoService.getProductoBySku(sku)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<Producto_Entity>> getProductosByCategoria(@PathVariable Long idCategoria) {
        List<Producto_Entity> productos = productoService.getProductosByCategoria(idCategoria);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/marca/{idMarca}")
    public ResponseEntity<List<Producto_Entity>> getProductosByMarca(@PathVariable Long idMarca) {
        List<Producto_Entity> productos = productoService.getProductosByMarca(idMarca);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto_Entity>> searchProductosByNombre(@RequestParam String nombre) {
        List<Producto_Entity> productos = productoService.searchProductosByNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Producto_Entity> createProducto(@RequestBody Producto_Entity producto) {
        try {
            Producto_Entity nuevoProducto = productoService.createProducto(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto_Entity> updateProducto(
            @PathVariable Long id,
            @RequestBody Producto_Entity producto) {
        try {
            Producto_Entity productoActualizado = productoService.updateProducto(id, producto);
            return ResponseEntity.ok(productoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

