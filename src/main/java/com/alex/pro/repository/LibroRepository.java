package com.alex.pro.repository;

import com.alex.pro.model.Libro;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // ⚙️ Componente Spring gestito dal container per le operazioni sul DB
public interface LibroRepository extends JpaRepository<Libro, Long> {

   // List<Libro> findLibrosByTitolo(String titolo, Sort sort);


    // 💡 Spring Data JPA crea automaticamente le Query SQL analizzando il nome dei metodi (Derived Queries)!

    // Trova tutti i prodotti dove il campo 'disponibile' corrisponde al parametro passato
   // List<Libro> findByDisponibile(Boolean disponibile);

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
   //  List<Libro> findByNomeContainingIgnoreCase(String nome);
    // ==================================================================================



}