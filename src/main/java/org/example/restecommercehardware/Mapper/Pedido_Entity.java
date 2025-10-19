package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pedidos", schema = "dbo")
public class Pedido_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "id_usuario")
    private Long idUsuario;

    @ColumnDefault("getdate()")
    @Column(name = "fecha_pedido")
    private Instant fechaPedido;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @ColumnDefault("'pendiente'")
    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Column(name = "direccion_envio")
    private String direccionEnvio;

    @Column(name = "ciudad_envio", length = 100)
    private String ciudadEnvio;

    @Column(name = "pais_envio", length = 100)
    private String paisEnvio;

    @Column(name = "codigo_postal_envio", length = 10)
    private String codigoPostalEnvio;

}