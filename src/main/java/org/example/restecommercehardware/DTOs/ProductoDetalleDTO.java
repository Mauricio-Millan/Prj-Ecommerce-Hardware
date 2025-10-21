package org.example.restecommercehardware.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDetalleDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String sku;
    private String imagenPortada;
    private Long idMarca;
    private String nombreMarca;
    private Long idCategoria;
    private String nombreCategoria;
}
