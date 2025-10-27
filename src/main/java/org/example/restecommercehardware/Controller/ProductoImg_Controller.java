package org.example.restecommercehardware.Controller;

import org.example.restecommercehardware.Mapper.ProductoImg_Entity;
import org.example.restecommercehardware.Service.ProductoImg_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/producto-imagenes")
@CrossOrigin(origins = "*")
public class ProductoImg_Controller {

    @Autowired
    private ProductoImg_Service productoImgService;

    @GetMapping
    public ResponseEntity<List<ProductoImg_Entity>> getAllProductoImgs() {
        return ResponseEntity.ok(productoImgService.getAllProductoImgs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoImg_Entity> getProductoImgById(@PathVariable Long id) {
        return productoImgService.getProductoImgById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<ProductoImg_Entity>> getImagenesByProducto(@PathVariable Long idProducto) {
        return ResponseEntity.ok(productoImgService.getImagenesByProducto(idProducto));
    }

    @PostMapping(value = "/producto/{idProducto}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImagen(
            @PathVariable Long idProducto,
            @RequestParam("file") MultipartFile file) {
        try {
            ProductoImg_Entity nuevaImagen = productoImgService.createProductoImg(idProducto, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaImagen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/orden")
    public ResponseEntity<?> updateProductoImg(
            @PathVariable Long id,
            @RequestParam Integer nuevoOrden) {
        try {
            ProductoImg_Entity imagenActualizada = productoImgService.updateProductoImg(id, nuevoOrden);
            return ResponseEntity.ok(imagenActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el orden: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductoImg(@PathVariable Long id) {
        productoImgService.deleteProductoImg(id);
        return ResponseEntity.noContent().build();
    }
}
