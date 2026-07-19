package com.alex.pro;

import com.alex.pro.model.Categoria;
import com.alex.pro.model.Prodotto;
import com.alex.pro.repository.CategoriaRepository;
import com.alex.pro.repository.ProdottoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class ProApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProApplication.class, args);
    }

    /**
     * 💡 POPOLAZIONE AUTOMATICA E RELAZIONALE DEL DATABASE ALL'AVVIO
     *
     * Iniettiamo sia il repository dei Prodotti sia quello delle Categorie.
     * Avendo 'ddl-auto: create-drop', ricreiamo la gerarchia da zero ad ogni avvio.
     */
    @Bean
    public CommandLineRunner initDatabase(ProdottoRepository prodottoRepository, CategoriaRepository categoriaRepository) {
        return args -> {

            // Verifichiamo se il database è vuoto per evitare duplicati in altre configurazioni
            if (categoriaRepository.count() == 0 && prodottoRepository.count() == 0) {
                System.out.println("🌱 Popolamento relazionale del Database in corso...");

                // -------------------------------------------------------------
                // 1. CREAZIONE E SALVATAGGIO DELLE CATEGORIE (Padre)
                // -------------------------------------------------------------
                Categoria catFrontend = new Categoria();
                catFrontend.setNome("Frontend Development");

                Categoria catBackend = new Categoria();
                catBackend.setNome("Backend Development");

                Categoria catDatabase = new Categoria();
                catDatabase.setNome("Database & Devops");

                // Salviamo le categorie. Questo genera gli ID (1, 2, 3) nel DB
                categoriaRepository.saveAll(List.of(catFrontend, catBackend, catDatabase));
                System.out.println("📦 Categorie create con successo.");

                // -------------------------------------------------------------
                // 2. CREAZIONE DEI PRODOTTI CON ASSOCIAZIONE DELLA CATEGORIA (Figlio)
                // -------------------------------------------------------------
                // Assicurati che nel costruttore di Prodotto l'ultimo parametro sia l'oggetto Categoria
                Prodotto p1 = new Prodotto(null, "Evoluzione Web con React", 29.99, 15, true, catFrontend);
                Prodotto p2 = new Prodotto(null, "Masterclass Tailwind CSS v4", 19.90, 25, true, catFrontend);

                Prodotto p3 = new Prodotto(null, "Guida Pratica a Spring Boot 3", 34.50, 8, true, catBackend);

                Prodotto p4 = new Prodotto(null, "Database PostgreSQL da Zero", 22.00, 0, false, catDatabase);

                // -------------------------------------------------------------
                // 3. SALVATAGGIO DEI PRODOTTI
                // -------------------------------------------------------------
                // JPA prenderà l'ID di ogni categoria e lo scriverà nella colonna foreign key 'categoria_id'
                prodottoRepository.saveAll(List.of(p1, p2, p3, p4));

                System.out.println("✅ Popolamento completato con successo!");
                System.out.println("📊 Record totali -> Categorie: " + categoriaRepository.count() + " | Prodotti: " + prodottoRepository.count());
            }
        };
    }
}