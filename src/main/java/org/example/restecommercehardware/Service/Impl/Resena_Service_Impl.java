package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Resena_Entity;
import org.example.restecommercehardware.Repository.Resena_Repository;
import org.example.restecommercehardware.Service.Resena_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Resena_Service_Impl implements Resena_Service {

    private final Resena_Repository resenaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Resena_Entity> getAllResenas() {
        return resenaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Resena_Entity> getResenaById(Long id) {
        return resenaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Resena_Entity> getResenasByProducto(Long idProducto) {
        return resenaRepository.findByIdProducto(idProducto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Resena_Entity> getResenasByUsuario(Long idUsuario) {
        return resenaRepository.findByIdUsuario(idUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Resena_Entity> getResenasByCalificacion(Integer calificacion) {
        return resenaRepository.findByCalificacion(calificacion);
    }

    @Override
    @Transactional
    public Resena_Entity createResena(Resena_Entity resena) {
        validarCalificacion(resena.getCalificacion());
        resena.setCreadoEn(Instant.now());
        return resenaRepository.save(resena);
    }

    @Override
    @Transactional
    public Resena_Entity updateResena(Long id, Resena_Entity resenaActualizada) {
        Resena_Entity resena = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + id));

        if (resenaActualizada.getCalificacion() != null) {
            validarCalificacion(resenaActualizada.getCalificacion());
        }

        actualizarCampos(resena, resenaActualizada);
        return resenaRepository.save(resena);
    }

    @Override
    @Transactional
    public void deleteResena(Long id) {
        if (!resenaRepository.existsById(id)) {
            throw new RuntimeException("Reseña no encontrada con id: " + id);
        }
        resenaRepository.deleteById(id);
    }

    private void validarCalificacion(Integer calificacion) {
        if (calificacion != null && (calificacion < 0 || calificacion > 5)) {
            throw new RuntimeException("La calificación debe estar entre 0 y 5");
        }
    }

    private void actualizarCampos(Resena_Entity destino, Resena_Entity origen) {
        if (origen.getIdProducto() != null) {
            destino.setIdProducto(origen.getIdProducto());
        }
        if (origen.getIdUsuario() != null) {
            destino.setIdUsuario(origen.getIdUsuario());
        }
        if (origen.getCalificacion() != null) {
            destino.setCalificacion(origen.getCalificacion());
        }
        if (origen.getComentario() != null) {
            destino.setComentario(origen.getComentario());
        }
    }
}

