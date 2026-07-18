package com.alex.pro.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "categorie")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    // Relazione bidirezionale (opzionale ma utile)
    // mappedBy indica che il vincolo della colonna (la FK) è gestito dal campo 'categoria' in Prodotto
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Prodotto> prodotti;

    // TODO: Genera Costruttori, Getter e Setter
}