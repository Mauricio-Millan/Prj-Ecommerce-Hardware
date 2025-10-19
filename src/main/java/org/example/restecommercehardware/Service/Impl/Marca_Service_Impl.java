package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Marca_Entity;
import org.example.restecommercehardware.Repository.Marca_Repository;
import org.example.restecommercehardware.Service.Marca_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Marca_Service_Impl implements Marca_Service {

    private final Marca_Repository marcaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Marca_Entity> getAllMarcas() {
        return marcaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Marca_Entity> getMarcaById(Long id) {
        return marcaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Marca_Entity> getMarcaByNombre(String nombre) {
        return marcaRepository.findByNombre(nombre);
    }

    @Override
    @Transactional
    public Marca_Entity createMarca(Marca_Entity marca) {
        validarNombreUnico(marca.getNombre());
        return marcaRepository.save(marca);
    }

    @Override
    @Transactional
    public Marca_Entity updateMarca(Long id, Marca_Entity marcaActualizada) {
        Marca_Entity marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada con id: " + id));

        if (marcaActualizada.getNombre() != null &&
            !marca.getNombre().equals(marcaActualizada.getNombre())) {
            validarNombreUnico(marcaActualizada.getNombre());
        }

        actualizarCampos(marca, marcaActualizada);
        return marcaRepository.save(marca);
    }

    @Override
    @Transactional
    public void deleteMarca(Long id) {
        if (!marcaRepository.existsById(id)) {
            throw new RuntimeException("Marca no encontrada con id: " + id);
        }
        marcaRepository.deleteById(id);
    }

    private void validarNombreUnico(String nombre) {
        if (marcaRepository.existsByNombre(nombre)) {
            throw new RuntimeException("Ya existe una marca con el nombre: " + nombre);
        }
    }

    private void actualizarCampos(Marca_Entity destino, Marca_Entity origen) {
        if (origen.getNombre() != null) {
            destino.setNombre(origen.getNombre());
        }
    }
}

