package com.alex.pro.service;

import com.alex.pro.model.Libro;
import com.alex.pro.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // ⚙️ Marca la classe come strato di Logica Applicativa
public class LibroService {



    @Autowired // 💉 Inietta l'istanza del Repository generata automaticamente da Spring
    private LibroRepository libroRepository;

    // ----------------------------------------------------------------------------------
    // READ (Lettura globale e per ID)
    // ----------------------------------------------------------------------------------
    public List<Libro> getAllLibri() {
        return libroRepository.findAll();
    }

    public Optional<Libro> getProdottoById(Long id) {
        return libroRepository.findById(id);
    }


    /*
    // ----------------------------------------------------------------------------------
    // CREATE / UPDATE STANDARD
    // ----------------------------------------------------------------------------------
    public Prodotto saveProdotto(Prodotto prodotto) {
        // .save() funziona sia per INSERIRE (se id è null) sia per AGGIORNARE (se id esiste già)
        return prodottoRepository.save(prodotto);
    }

    // ----------------------------------------------------------------------------------
    // DELETE (Cancellazione)
    // ----------------------------------------------------------------------------------
    public boolean deleteProdotto(Long id) {
        if (prodottoRepository.existsById(id)) {
            prodottoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ----------------------------------------------------------------------------------
    // BUSINESS LOGIC SPECIFICA: Modifica dello stato (Come la prenotazione dell'Ombrellone)
    // ----------------------------------------------------------------------------------
    public Optional<Prodotto> cambiaDisponibilita(Long id, Boolean nuovoStato) {
        // 1. Cerchiamo l'entità
        Optional<Prodotto> optionalProdotto = prodottoRepository.findById(id);

        // 2. Se esiste, modifichiamo lo stato e salviamo
        if (optionalProdotto.isPresent()) {
            Prodotto prod = optionalProdotto.get();
            prod.setDisponibile(nuovoStato);
            return Optional.of(prodottoRepository.save(prod)); // Salva e restituisce l'oggetto aggiornato
        }

        // 3. Se l'ID non esiste, restituisce Optional vuoto
        return Optional.empty();
    }

    // ==================================================================================
    // 🛠️ CASI DI MODIFICA ALL'ESAME:
    //
    // CASO A: Scalare una quantità dopo un acquisto/azione (Logica di business)
    //
    // public Optional<Prodotto> riduciScorta(Long id, int quantitaDaScalare) {
    //     return prodottoRepository.findById(id).map(prod -> {
    //         if (prod.getQuantita() >= quantitaDaScalare) {
    //             prod.setQuantita(prod.getQuantita() - quantitaDaScalare);
    //             return prodottoRepository.save(prod);
    //         }
    //         throw new RuntimeException("Quantità non sufficiente!");
    //     });
    // }
    //
    // CASO B: Utilizzo di metodi lambda avanzati per abbreviare il codice
    //
    // public Prodotto getProdottoOrThrow(Long id) {
    //     return prodottoRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Prodotto non trovato con ID: " + id));
    // }
    // ==================================================================================


     */
}