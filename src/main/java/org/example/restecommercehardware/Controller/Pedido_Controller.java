package org.example.restecommercehardware.Controller;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Pedido_Entity;
import org.example.restecommercehardware.Service.Pedido_Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class Pedido_Controller {

    private final Pedido_Service pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedido_Entity>> getAllPedidos() {
        List<Pedido_Entity> pedidos = pedidoService.getAllPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido_Entity> getPedidoById(@PathVariable Long id) {
        return pedidoService.getPedidoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Pedido_Entity>> getPedidosByUsuario(@PathVariable Long idUsuario) {
        List<Pedido_Entity> pedidos = pedidoService.getPedidosByUsuario(idUsuario);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Pedido_Entity>> getPedidosByEstado(@PathVariable String estado) {
        List<Pedido_Entity> pedidos = pedidoService.getPedidosByEstado(estado);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping
    public ResponseEntity<Pedido_Entity> createPedido(@RequestBody Pedido_Entity pedido) {
        try {
            Pedido_Entity nuevoPedido = pedidoService.createPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido_Entity> updatePedido(
            @PathVariable Long id,
            @RequestBody Pedido_Entity pedido) {
        try {
            Pedido_Entity pedidoActualizado = pedidoService.updatePedido(id, pedido);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        try {
            pedidoService.deletePedido(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


