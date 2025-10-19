package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios", schema = "dbo")
public class Usuario_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido", length = 50)
    private String apellido;

    @Column(name = "correo_electronico", nullable = false, length = 100)
    private String correoElectronico;

    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @Column(name = "pais", length = 100)
    private String pais;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

    @ColumnDefault("getdate()")
    @Column(name = "actualizado_en")
    private Instant actualizadoEn;

}