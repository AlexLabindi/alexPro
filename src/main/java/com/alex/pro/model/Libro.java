package com.alex.pro.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 💡 ANNOTAZIONI LOMBOK:
 * @Data genera automaticamente Getter, Setter, toString(), equals() e hashCode().
 * Evita di dover scrivere manualmente 50+ righe di codice ripetitivo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "libri")
public class Libro {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ----------------------------------------------------------------------------------
    // CAMPI DELL'ENTITÀ
    // ----------------------------------------------------------------------------------

    @Column(nullable = false)
    private String titolo;

    private String descrizione;

    private Double prezzo; // Usiamo le Wrapper Class (Double, Integer) invece dei primitivi per gestire i null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autore_id")
    private Autore autore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genere_id")
    private Genere genere;



   /*
    // ==================================================================================
    // 🛠️ CASI DI MODIFICA ALL'ESAME:
    //
    // CASO A: Relazione con un'altra Entità (Es. Prodotto appartiene a una Categoria)
    //         Scommenta per aggiungere una Foreign Key:
    //
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "categoria_id") // Nome della colonna FK nel database
    // private Categoria categoria;
    //
    // CASO B: Aggiungere una data di creazione automatica:
    //
    // private LocalDateTime dataCreazione = LocalDateTime.now();
    // ==================================================================================


     */
}