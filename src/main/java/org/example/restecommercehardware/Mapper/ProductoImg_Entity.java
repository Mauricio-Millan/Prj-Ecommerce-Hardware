package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "producto_img", schema = "dbo")
public class ProductoImg_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "id_producto")
    private Long idProducto;

    @Column(name = "UrlImagen")
    private String urlImagen;

    @Column(name = "orden")
    private Integer orden;

}