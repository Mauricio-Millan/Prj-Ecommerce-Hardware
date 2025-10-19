package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.example.restecommercehardware.Service.Usuario_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class Usuario_Controller {

    private final Usuario_Service usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario_Entity>> getAllUsuarios() {
        List<Usuario_Entity> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario_Entity> getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{correo}")
    public ResponseEntity<Usuario_Entity> getUsuarioByEmail(@PathVariable String correo) {
        return usuarioService.getUsuarioByEmail(correo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario_Entity> createUsuario(@RequestBody Usuario_Entity usuario) {
        try {
            Usuario_Entity nuevoUsuario = usuarioService.createUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario_Entity> updateUsuario(
            @PathVariable Long id,
            @RequestBody Usuario_Entity usuario) {
        try {
            Usuario_Entity usuarioActualizado = usuarioService.updateUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/exists/{correo}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String correo) {
        boolean exists = usuarioService.existsByEmail(correo);
        return ResponseEntity.ok(exists);
    }
}
