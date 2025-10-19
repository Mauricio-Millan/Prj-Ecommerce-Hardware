package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "items_carrito", schema = "dbo")
public class ItemsCarrito_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "id_carrito")
    private Long idCarrito;

    @Column(name = "id_producto")
    private Long idProducto;

    @ColumnDefault("1")
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

}