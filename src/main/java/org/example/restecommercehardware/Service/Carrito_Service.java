package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Carrito_Entity;

import java.util.List;
import java.util.Optional;

public interface Carrito_Service {
    List<Carrito_Entity> getAllCarritos();
    Optional<Carrito_Entity> getCarritoById(Long id);
    Optional<Carrito_Entity> getCarritoByUsuario(Long idUsuario);
    Carrito_Entity createCarrito(Carrito_Entity carrito);
    Carrito_Entity updateCarrito(Long id, Carrito_Entity carrito);
    void deleteCarrito(Long id);
}

