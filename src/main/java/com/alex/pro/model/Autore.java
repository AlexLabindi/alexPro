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
public class Autore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private String cognome;

    @OneToMany(mappedBy = "autore", cascade = CascadeType.ALL)
    private List<Libro> libri;


}
