package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Resena_Entity;
import org.example.restecommercehardware.Service.Resena_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@RequiredArgsConstructor
public class Resena_Controller {

    private final Resena_Service resenaService;

    @GetMapping
    public ResponseEntity<List<Resena_Entity>> getAllResenas() {
        List<Resena_Entity> resenas = resenaService.getAllResenas();
        return ResponseEntity.ok(resenas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resena_Entity> getResenaById(@PathVariable Long id) {
        return resenaService.getResenaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<Resena_Entity>> getResenasByProducto(@PathVariable Long idProducto) {
        List<Resena_Entity> resenas = resenaService.getResenasByProducto(idProducto);
        return ResponseEntity.ok(resenas);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Resena_Entity>> getResenasByUsuario(@PathVariable Long idUsuario) {
        List<Resena_Entity> resenas = resenaService.getResenasByUsuario(idUsuario);
        return ResponseEntity.ok(resenas);
    }

    @GetMapping("/calificacion/{calificacion}")
    public ResponseEntity<List<Resena_Entity>> getResenasByCalificacion(@PathVariable Integer calificacion) {
        List<Resena_Entity> resenas = resenaService.getResenasByCalificacion(calificacion);
        return ResponseEntity.ok(resenas);
    }

    @PostMapping
    public ResponseEntity<Resena_Entity> createResena(@RequestBody Resena_Entity resena) {
        try {
            Resena_Entity nuevaResena = resenaService.createResena(resena);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaResena);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resena_Entity> updateResena(
            @PathVariable Long id,
            @RequestBody Resena_Entity resena) {
        try {
            Resena_Entity resenaActualizada = resenaService.updateResena(id, resena);
            return ResponseEntity.ok(resenaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResena(@PathVariable Long id) {
        try {
            resenaService.deleteResena(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


