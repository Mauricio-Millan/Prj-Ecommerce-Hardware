package org.example.restecommercehardware.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    private String correoElectronico;
    private String contrasena;
}

