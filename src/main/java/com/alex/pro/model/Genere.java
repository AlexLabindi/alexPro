package com.alex.pro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "genere")
public class Genere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ⚙️ Auto-incremento gestito da PostgreSQL (SERIAL / BIGSERIAL)
    private Long id;

    // ----------------------------------------------------------------------------------
    // CAMPI DELL'ENTITÀ
    // ----------------------------------------------------------------------------------

    @Column(nullable = false)
    private String nome;

    @OneToMany(mappedBy = "genere", cascade = CascadeType.ALL)
    private List<Libro> libri;


}
