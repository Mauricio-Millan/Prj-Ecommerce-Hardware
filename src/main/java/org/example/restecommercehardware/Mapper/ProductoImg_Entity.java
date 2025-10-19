package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "producto_img", schema = "dbo")
public class ProductoImg_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto_Entity idProducto;

    @Size(max = 255)
    @Nationalized
    @Column(name = "UrlImagen")
    private String urlImagen;

    @Column(name = "orden")
    private Integer orden;

}