package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Marca_Entity;
import org.example.restecommercehardware.Service.Marca_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
public class Marca_Controller {

    private final Marca_Service marcaService;

    @GetMapping
    public ResponseEntity<List<Marca_Entity>> getAllMarcas() {
        List<Marca_Entity> marcas = marcaService.getAllMarcas();
        return ResponseEntity.ok(marcas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca_Entity> getMarcaById(@PathVariable Long id) {
        return marcaService.getMarcaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Marca_Entity> getMarcaByNombre(@PathVariable String nombre) {
        return marcaService.getMarcaByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Marca_Entity> createMarca(@RequestBody Marca_Entity marca) {
        try {
            Marca_Entity nuevaMarca = marcaService.createMarca(marca);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMarca);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca_Entity> updateMarca(
            @PathVariable Long id,
            @RequestBody Marca_Entity marca) {
        try {
            Marca_Entity marcaActualizada = marcaService.updateMarca(id, marca);
            return ResponseEntity.ok(marcaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarca(@PathVariable Long id) {
        try {
            marcaService.deleteMarca(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

