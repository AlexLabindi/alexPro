package com.alex.pro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity // 🔑 Indica a Spring JPA che questa classe corrisponde a una TABELLA del Database
@Table(name = "autore")
public class Autore {

    @Id // 🔑 Campo Chiave Primaria (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ⚙️ Auto-incremento gestito da PostgreSQL (SERIAL / BIGSERIAL)
    private Long id;

    // ----------------------------------------------------------------------------------
    // CAMPI DELL'ENTITÀ
    // ----------------------------------------------------------------------------------

    @Column(nullable = false) // 🛑 Rendiamo il campo obbligatorio a livello di DB (NOT NULL)
    private String nome;
    @Column(nullable = false)
    private String cognome;

    @OneToMany(mappedBy = "autore", cascade = CascadeType.ALL)
    private List<Libro> libri;


}
