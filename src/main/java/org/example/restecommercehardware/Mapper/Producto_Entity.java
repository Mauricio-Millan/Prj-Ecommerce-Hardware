package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos", schema = "dbo")
public class Producto_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Nationalized
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "sku", length = 50)
    private String sku;

    @Nationalized
    @Column(name = "url_imagen")
    private String urlImagen;

    @Column(name = "id_categoria")
    private Long idCategoria;

    @Column(name = "id_marca")
    private Long idMarca;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

    @ColumnDefault("getdate()")
    @Column(name = "actualizado_en")
    private Instant actualizadoEn;

}