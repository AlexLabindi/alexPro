package com.alex.pro.service;

import com.alex.pro.dto.ProdottoRequestDTO;
import com.alex.pro.dto.ProdottoResponseDTO;
import com.alex.pro.exception.ResourceNotFoundException;
import com.alex.pro.model.Categoria;
import com.alex.pro.model.Prodotto;
import com.alex.pro.repository.CategoriaRepository;
import com.alex.pro.repository.ProdottoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // ⚙️ Marca la classe come strato di Logica Applicativa
public class ProdottoService {


    // 1. Definiamo entrambi i repository come final
    private final ProdottoRepository prodottoRepository;
    private final CategoriaRepository categoriaRepository;

    // 2. UNICO COSTRUTTORE: Spring Boot lo userà in automatico
    // per iniettare le dipendenze (Dependency Injection tramite costruttore)
    public ProdottoService(ProdottoRepository prodottoRepository, CategoriaRepository categoriaRepository) {
        this.prodottoRepository = prodottoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    public Page<Prodotto> ricercaAvanzata(String nome, Pageable pageable) {
        // Se il parametro di ricerca è vuoto o nullo, restituisce tutto ma paginato
        if (nome == null || nome.trim().isEmpty()) {
            return prodottoRepository.findAll(pageable);
        }
        // Altrimenti esegue il filtro
        return prodottoRepository.findByNomeContainingIgnoreCase(nome, pageable);
    }
    // ----------------------------------------------------------------------------------
    // READ (Lettura globale e per ID)
    // ----------------------------------------------------------------------------------
    public List<Prodotto> getAllProdotti() {
        return prodottoRepository.findAll();
    }

    public Optional<Prodotto> getProdottoById(Long id) {
        return Optional.of(prodottoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto non trovato con id: " + id)));
    }


    // Esempio di inserimento nel ProdottoService:

    public ProdottoResponseDTO creaProdotto(ProdottoRequestDTO dto) {
        Prodotto prodotto = new Prodotto();
        prodotto.setNome(dto.nome());
        prodotto.setPrezzo(dto.prezzo());
        prodotto.setQuantita(dto.quantita());
        prodotto.setDisponibile(dto.disponibile());

        // Se è stato passato un ID categoria, lo cerchiamo e lo associamo
        if (dto.categoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria non trovata"));
            prodotto.setCategoria(cat);
        }

        Prodotto salvato = prodottoRepository.save(prodotto);

        // Mappiamo l'entità salvata nel DTO di risposta
        return new ProdottoResponseDTO(
                salvato.getId(),
                salvato.getNome(),
                salvato.getPrezzo(),
                salvato.getQuantita(),
                salvato.isDisponibile(),
                salvato.getCategoria() != null ? salvato.getCategoria().getNome() : "Nessuna"
        );
    }
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



}