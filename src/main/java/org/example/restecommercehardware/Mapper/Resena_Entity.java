package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resenas", schema = "dbo")
public class Resena_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "id_producto")
    private Long idProducto;

    @Column(name = "id_usuario")
    private Long idUsuario;

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