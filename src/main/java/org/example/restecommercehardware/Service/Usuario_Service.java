package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.Usuario_Entity;

import java.util.List;
import java.util.Optional;

public interface Usuario_Service {
    List<Usuario_Entity> getAllUsuarios();
    Optional<Usuario_Entity> getUsuarioById(Long id);
    Optional<Usuario_Entity> getUsuarioByEmail(String correoElectronico);
    Usuario_Entity createUsuario(Usuario_Entity usuario);
    Usuario_Entity updateUsuario(Long id, Usuario_Entity usuario);
    void deleteUsuario(Long id);
    boolean existsByEmail(String correoElectronico);
}
