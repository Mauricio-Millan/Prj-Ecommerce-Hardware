package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.Usuario_Entity;
import org.example.restecommercehardware.Repository.Usuario_Repository;
import org.example.restecommercehardware.Service.Usuario_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Usuario_Service_Impl implements Usuario_Service {

    private final Usuario_Repository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario_Entity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario_Entity> getUsuarioById(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario_Entity> getUsuarioByEmail(String correoElectronico) {
        return usuarioRepository.findByCorreoElectronico(correoElectronico);
    }

    @Override
    @Transactional
    public Usuario_Entity createUsuario(Usuario_Entity usuario) {
        validarCorreoUnico(usuario.getCorreoElectronico());
        usuario.setCreadoEn(Instant.now());
        usuario.setActualizadoEn(Instant.now());
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public Usuario_Entity updateUsuario(Long id, Usuario_Entity usuarioActualizado) {
        Usuario_Entity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // Validar correo electrónico si cambió
        if (usuarioActualizado.getCorreoElectronico() != null &&
            !usuario.getCorreoElectronico().equals(usuarioActualizado.getCorreoElectronico())) {
            validarCorreoUnico(usuarioActualizado.getCorreoElectronico());
        }

        // Actualizar campos
        actualizarCampos(usuario, usuarioActualizado);
        usuario.setActualizadoEn(Instant.now());

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String correoElectronico) {
        return usuarioRepository.existsByCorreoElectronico(correoElectronico);
    }

    // Métodos privados de utilidad
    private void validarCorreoUnico(String correoElectronico) {
        if (usuarioRepository.existsByCorreoElectronico(correoElectronico)) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + correoElectronico);
        }
    }

    private void actualizarCampos(Usuario_Entity destino, Usuario_Entity origen) {
        if (origen.getNombre() != null) {
            destino.setNombre(origen.getNombre());
        }
        if (origen.getApellido() != null) {
            destino.setApellido(origen.getApellido());
        }
        if (origen.getCorreoElectronico() != null) {
            destino.setCorreoElectronico(origen.getCorreoElectronico());
        }
        if (origen.getHashContrasena() != null) {
            destino.setHashContrasena(origen.getHashContrasena());
        }
        if (origen.getNumeroTelefono() != null) {
            destino.setNumeroTelefono(origen.getNumeroTelefono());
        }
        if (origen.getDireccion() != null) {
            destino.setDireccion(origen.getDireccion());
        }
        if (origen.getCiudad() != null) {
            destino.setCiudad(origen.getCiudad());
        }
        if (origen.getPais() != null) {
            destino.setPais(origen.getPais());
        }
        if (origen.getCodigoPostal() != null) {
            destino.setCodigoPostal(origen.getCodigoPostal());
        }
    }
}
