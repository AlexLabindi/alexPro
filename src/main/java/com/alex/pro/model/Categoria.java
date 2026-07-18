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
}