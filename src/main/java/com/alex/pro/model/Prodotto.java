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
@Entity // 🔑 Indica a Spring JPA che questa classe corrisponde a una TABELLA del Database
@Table(name = "prodotti") // 📌 (Opzionale) Personalizza il nome della tabella SQL
public class Prodotto {

    @Id // 🔑 Campo Chiave Primaria (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ⚙️ Auto-incremento gestito da PostgreSQL (SERIAL / BIGSERIAL)
    private Long id;

    // ----------------------------------------------------------------------------------
    // CAMPI DELL'ENTITÀ
    // ----------------------------------------------------------------------------------

    @Column(nullable = false) // 🛑 Rendiamo il campo obbligatorio a livello di DB (NOT NULL)
    private String nome;

    private Double prezzo; // Usiamo le Wrapper Class (Double, Integer) invece dei primitivi per gestire i null

    private Integer quantita;

    private Boolean disponibile = true; // Flag di stato con valore di default a true

    @ManyToOne(fetch = FetchType.LAZY) // LAZY carica la categoria solo se esplicitamente richiesta
    @JoinColumn(name = "categoria_id", nullable = true) // Crea la Foreign Key nel DB
    private Categoria categoria;

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
}