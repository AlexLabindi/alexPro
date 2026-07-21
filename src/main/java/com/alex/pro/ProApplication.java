package com.alex.pro;

import com.alex.pro.model.Autore;
import com.alex.pro.model.Genere;
import com.alex.pro.model.Libro;
import com.alex.pro.repository.AutoreRepository;
import com.alex.pro.repository.GenereRepository;
import com.alex.pro.repository.LibroRepository;
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
     * 💡 POPOLAZIONE AUTOMATICA DEL DATABASE ALL'AVVIO
     *
     * Il metodo annotated con @Bean che restituisce un CommandLineRunner viene eseguito
     * AUTOMATICAMENTE da Spring Boot subito dopo l'avvio del contesto dell'applicazione.
     *
     * Poiché in application.yml abbiamo 'ddl-auto: create-drop', ad ogni riavvio le tabelle
     * vengono ricreate vuote. Questo runner reinserisce subito dei dati di prova puliti!
     */


    @Bean
    public CommandLineRunner initDatabase(LibroRepository repository, GenereRepository genereRepository, AutoreRepository autoreRepository) {


        return args -> {
            // Verifichiamo se il database è vuoto prima di inserire i dati di test

            if (repository.count() == 0) {

                System.out.println("🌱 Popolamento iniziale del Database in corso...");
                Autore a1 = new Autore();
                a1.setNome("sdvs");
                a1.setCognome("fdvbdb");
                Genere t1 = new Genere();
                t1.setNome("blood");
                Libro p1 = new Libro(null, "bib dei mortri", "dvnsvnlskfdv", 12.12, a1, t1);

                Autore a2 = new Autore();
                a2.setNome("sdvs");
                a2.setCognome("fdvbdb");
                Genere t2 = new Genere();
                t2.setNome("blood");
                Libro p2 = new Libro(null,"non solo occhi ", "dvnsvnlskfdv",13.12, a2, t2);


                Autore a3 = new Autore();
                a3.setNome("sdvs");
                a3.setCognome("fdvbdb");
                Genere t3 = new Genere();
                t3.setNome("blood");
                Libro p3 = new Libro(null,"scorpione", "dvnsvnlskfdv",13.12, a3, t3);

                Autore a4 = new Autore();
                a4.setNome("sdvs");
                a4.setCognome("fdvbdb");
                Genere t4 = new Genere();
                t4.setNome("blood");
                Libro p4 = new Libro(null, "guida galattica", "dvnsvnlskfdv",15.12, a4, t4);



                // .saveAll() esegue una sola transazione SQL per salvare l'intera lista
                autoreRepository.saveAll(List.of(a1,a2,a3,a4));
                genereRepository.saveAll(List.of(t1,t2,t3,t4));
                repository.saveAll(List.of(p1,p2,p3,p4));

                System.out.println("✅ Popolamento completato! Inseriti " + repository.count() + " libri.");
            }
        };
    }
}
/*@SpringBootApplication
public class ProApplication {

    public static void main(String[] args) {
        // 1. Avviamo Spring e salviamo il contesto dell'applicazione in una variabile
        ConfigurableApplicationContext context = SpringApplication.run(ProApplication.class, args);

        // 2. Chiediamo a Spring di darci il Bean della nostra Repository
        ProdottoRepository repository = context.getBean(ProdottoRepository.class);

        // 3. Popoliamo il database con i new direttamente nel main!
        if (repository.count() == 0) {
            System.out.println("🌱 Popolamento iniziale del DB in corso...");

            Prodotto p1 = new Prodotto(null, "Evoluzione Web con React", 29.99, 15, true);
            Prodotto p2 = new Prodotto(null, "Guida Pratica a Spring Boot 3", 34.50, 8, true);
            Prodotto p3 = new Prodotto(null, "Database PostgreSQL da Zero", 22.00, 0, false);
            Prodotto p4 = new Prodotto(null, "Masterclass Tailwind CSS v4", 19.90, 25, true);

            repository.saveAll(List.of(p1, p2, p3, p4));

            System.out.println("✅ Inseriti " + repository.count() + " prodotti di test!");
        }
    }

 */
