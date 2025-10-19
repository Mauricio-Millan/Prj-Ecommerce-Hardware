package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "resenas", schema = "dbo")
public class Resena_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto_Entity idProducto;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario_Entity idUsuario;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "calificacion", nullable = false)
    private Integer calificacion;

    @Lob
    @Column(name = "comentario")
    private String comentario;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

}