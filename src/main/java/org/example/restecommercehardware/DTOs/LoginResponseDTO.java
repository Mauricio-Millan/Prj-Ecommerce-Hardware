package org.example.restecommercehardware.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.restecommercehardware.Mapper.Usuario_Entity;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private boolean success;
    private String message;
    private Usuario_Entity usuario;
}
