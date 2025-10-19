package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "carrito", schema = "dbo")
public class Carrito_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario_Entity idUsuario;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

}