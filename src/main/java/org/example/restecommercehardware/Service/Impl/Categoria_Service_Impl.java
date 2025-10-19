package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Categoria_Entity;
import org.example.restecommercehardware.Repository.Categoria_Repository;
import org.example.restecommercehardware.Service.Categoria_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Categoria_Service_Impl implements Categoria_Service {

    private final Categoria_Repository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Categoria_Entity> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria_Entity> getCategoriaById(Long id) {
        return categoriaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria_Entity> getCategoriaByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre);
    }

    @Override
    @Transactional
    public Categoria_Entity createCategoria(Categoria_Entity categoria) {
        validarNombreUnico(categoria.getNombre());
        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional
    public Categoria_Entity updateCategoria(Long id, Categoria_Entity categoriaActualizada) {
        Categoria_Entity categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        if (categoriaActualizada.getNombre() != null &&
            !categoria.getNombre().equals(categoriaActualizada.getNombre())) {
            validarNombreUnico(categoriaActualizada.getNombre());
        }

        actualizarCampos(categoria, categoriaActualizada);
        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional
    public void deleteCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    private void validarNombreUnico(String nombre) {
        if (categoriaRepository.existsByNombre(nombre)) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + nombre);
        }
    }

    private void actualizarCampos(Categoria_Entity destino, Categoria_Entity origen) {
        if (origen.getNombre() != null) {
            destino.setNombre(origen.getNombre());
        }
        if (origen.getDescripcion() != null) {
            destino.setDescripcion(origen.getDescripcion());
        }
    }
}

