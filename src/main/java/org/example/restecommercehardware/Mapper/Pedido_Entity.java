package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "pedidos", schema = "dbo")
public class Pedido_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario_Entity idUsuario;

    @ColumnDefault("getdate()")
    @Column(name = "fecha_pedido")
    private Instant fechaPedido;

    @NotNull
    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'pendiente'")
    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Size(max = 255)
    @Column(name = "direccion_envio")
    private String direccionEnvio;

    @Size(max = 100)
    @Column(name = "ciudad_envio", length = 100)
    private String ciudadEnvio;

    @Size(max = 100)
    @Column(name = "pais_envio", length = 100)
    private String paisEnvio;

    @Size(max = 10)
    @Column(name = "codigo_postal_envio", length = 10)
    private String codigoPostalEnvio;

}