package com.alex.pro.repository;

import com.alex.pro.model.Prodotto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // ⚙️ Componente Spring gestito dal container per le operazioni sul DB
public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {



    // 💡 Spring Data JPA crea automaticamente le Query SQL analizzando il nome dei metodi (Derived Queries)!

    // Trova tutti i prodotti dove il campo 'disponibile' corrisponde al parametro passato
    List<Prodotto> findByDisponibile(Boolean disponibile);

    // Spring Data JPA capisce automaticamente la query e gestisce il calcolo del "Total Elements" per la paginazione
    Page<Prodotto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    // ==================================================================================
    // 🛠️ CASI DI MODIFICA ALL'ESAME:
    //
    // CASO A: Cercare tutti i prodotti che appartengono a un'altra entità (Relazione FK)
    //         Se Prodotto ha un campo 'categoria', puoi cercare per l'ID della categoria:
    //
    // List<Prodotto> findByCategoriaId(Long categoriaId);
    //
    // CASO B: Ricerca testuale parziale (Ignorando Maiuscole/Minuscole)
    //
    // List<Prodotto> findByNomeContainingIgnoreCase(String nome);
    // ==================================================================================



}