package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "usuarios", schema = "dbo", uniqueConstraints = {
        @UniqueConstraint(name = "UQ__usuarios__5B8A0682472D3DC4", columnNames = {"correo_electronico"})
})
public class Usuario_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Size(max = 50)
    @Column(name = "apellido", length = 50)
    private String apellido;

    @Size(max = 100)
    @NotNull
    @Column(name = "correo_electronico", nullable = false, length = 100)
    private String correoElectronico;

    @Size(max = 255)
    @NotNull
    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Size(max = 20)
    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    @Size(max = 255)
    @Column(name = "direccion")
    private String direccion;

    @Size(max = 100)
    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @Size(max = 100)
    @Column(name = "pais", length = 100)
    private String pais;

    @Size(max = 10)
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

    @ColumnDefault("getdate()")
    @Column(name = "actualizado_en")
    private Instant actualizadoEn;

}