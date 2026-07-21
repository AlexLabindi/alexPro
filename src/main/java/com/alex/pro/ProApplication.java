package com.alex.pro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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

    /*
    @Bean
    public CommandLineRunner initDatabase(ProdottoRepository repository) {


        return args -> {
            // Verifichiamo se il database è vuoto prima di inserire i dati di test
            if (repository.count() == 0) {
                System.out.println("🌱 Popolamento iniziale del Database in corso...");

                Prodotto p1 = new Prodotto(null, "Evoluzione Web con React", 29.99, 15, true);
                Prodotto p2 = new Prodotto(null, "Guida Pratica a Spring Boot 3", 34.50, 8, true);
                Prodotto p3 = new Prodotto(null, "Database PostgreSQL da Zero", 22.00, 0, false);
                Prodotto p4 = new Prodotto(null, "Masterclass Tailwind CSS v4", 19.90, 25, true);

                // .saveAll() esegue una sola transazione SQL per salvare l'intera lista
                repository.saveAll(List.of(p1, p2, p3, p4));

                System.out.println("✅ Popolamento completato! Inseriti " + repository.count() + " prodotti.");
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
}