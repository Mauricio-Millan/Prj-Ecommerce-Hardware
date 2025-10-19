package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "items_carrito", schema = "dbo")
public class ItemsCarrito_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_carrito")
    private Carrito_Entity idCarrito;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto_Entity idProducto;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

}