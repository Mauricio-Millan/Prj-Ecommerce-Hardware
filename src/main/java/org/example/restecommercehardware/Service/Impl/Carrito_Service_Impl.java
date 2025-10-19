package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Carrito_Entity;
import org.example.restecommercehardware.Repository.Carrito_Repository;
import org.example.restecommercehardware.Service.Carrito_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Carrito_Service_Impl implements Carrito_Service {

    private final Carrito_Repository carritoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Carrito_Entity> getAllCarritos() {
        return carritoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Carrito_Entity> getCarritoById(Long id) {
        return carritoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Carrito_Entity> getCarritoByUsuario(Long idUsuario) {
        return carritoRepository.findByIdUsuario(idUsuario);
    }

    @Override
    @Transactional
    public Carrito_Entity createCarrito(Carrito_Entity carrito) {
        carrito.setCreadoEn(Instant.now());
        return carritoRepository.save(carrito);
    }

    @Override
    @Transactional
    public Carrito_Entity updateCarrito(Long id, Carrito_Entity carritoActualizado) {
        Carrito_Entity carrito = carritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + id));

        if (carritoActualizado.getIdUsuario() != null) {
            carrito.setIdUsuario(carritoActualizado.getIdUsuario());
        }
        return carritoRepository.save(carrito);
    }

    @Override
    @Transactional
    public void deleteCarrito(Long id) {
        if (!carritoRepository.existsById(id)) {
            throw new RuntimeException("Carrito no encontrado con id: " + id);
        }
        carritoRepository.deleteById(id);
    }
}

