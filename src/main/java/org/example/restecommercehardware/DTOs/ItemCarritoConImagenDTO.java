package org.example.restecommercehardware.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarritoConImagenDTO {
    private Long id;
    private Long idCarrito;
    private Long idProducto;
    private String nombreProducto;
    private String descripcionProducto;
    private BigDecimal precioProducto;
    private Integer stockProducto;
    private String skuProducto;
    private Integer cantidad;
    private String imagenPortada;
    private BigDecimal subtotal;
}

