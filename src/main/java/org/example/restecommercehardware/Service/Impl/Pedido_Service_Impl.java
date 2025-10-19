package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Pedido_Entity;
import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.example.restecommercehardware.Repository.Pedido_Repository;
import org.example.restecommercehardware.Repository.Usuario_Repository;
import org.example.restecommercehardware.Service.Pedido_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Pedido_Service_Impl implements Pedido_Service {

    private final Pedido_Repository pedidoRepository;
    private final Usuario_Repository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Pedido_Entity> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pedido_Entity> getPedidoById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido_Entity> getPedidosByUsuario(Long idUsuario) {
        Usuario_Entity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + idUsuario));
        return pedidoRepository.findByIdUsuario(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido_Entity> getPedidosByEstado(String estado) {
        return pedidoRepository.findByEstado(estado);
    }

    @Override
    @Transactional
    public Pedido_Entity createPedido(Pedido_Entity pedido) {
        pedido.setFechaPedido(Instant.now());
        if (pedido.getEstado() == null) {
            pedido.setEstado("pendiente");
        }
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public Pedido_Entity updatePedido(Long id, Pedido_Entity pedidoActualizado) {
        Pedido_Entity pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));

        actualizarCampos(pedido, pedidoActualizado);
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public void deletePedido(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado con id: " + id);
        }
        pedidoRepository.deleteById(id);
    }

    private void actualizarCampos(Pedido_Entity destino, Pedido_Entity origen) {
        if (origen.getMontoTotal() != null) {
            destino.setMontoTotal(origen.getMontoTotal());
        }
        if (origen.getEstado() != null) {
            destino.setEstado(origen.getEstado());
        }
        if (origen.getDireccionEnvio() != null) {
            destino.setDireccionEnvio(origen.getDireccionEnvio());
        }
        if (origen.getCiudadEnvio() != null) {
            destino.setCiudadEnvio(origen.getCiudadEnvio());
        }
        if (origen.getPaisEnvio() != null) {
            destino.setPaisEnvio(origen.getPaisEnvio());
        }
        if (origen.getCodigoPostalEnvio() != null) {
            destino.setCodigoPostalEnvio(origen.getCodigoPostalEnvio());
        }
    }
}
