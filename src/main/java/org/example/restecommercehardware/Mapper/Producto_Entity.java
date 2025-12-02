package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "productos", schema = "dbo", uniqueConstraints = {
        @UniqueConstraint(name = "UQ__producto__DDDF4BE783EDAB62", columnNames = {"sku"})
})
public class Producto_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @NotNull
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @NotNull
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Size(max = 50)
    @Column(name = "sku", length = 50)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria_Entity idCategoria;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca_Entity idMarca;

    @ColumnDefault("getdate()")
    @Column(name = "creado_en")
    private Instant creadoEn;

    @ColumnDefault("getdate()")
    @Column(name = "actualizado_en")
    private Instant actualizadoEn;

}