package org.example.restecommercehardware.Mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "marcas", schema = "dbo", uniqueConstraints = {
        @UniqueConstraint(name = "UQ__marcas__72AFBCC63A874283", columnNames = {"nombre"})
})
public class Marca_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

}