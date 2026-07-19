package com.alex.pro.controller;

import com.alex.pro.dto.ProdottoResponseDTO;
import com.alex.pro.model.Prodotto;
import com.alex.pro.service.ProdottoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RequiredArgsConstructor ..Genererà il costruttore corretto in automatico per tutti i campi contrassegnati come private final.
@RestController // ⚙️ Risponde automaticamente serializzando i dati in formato JSON
@RequestMapping("/api/prodotti") // 🛣️ Prefisso comune delle rotte
@CrossOrigin(origins = "http://localhost:5173") // 🔌 Indispensabile per evitare blocchi CORS da React
public class ProdottoController {


    @Autowired
    private ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    /**
     * GET avanzata con Paginazione, Filtro sul nome e Ordinamento.
     * Esempio: /api/prodotti/search?page=0&size=5&sortBy=prezzo&direction=DESC&nome=tastiera
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProdottoResponseDTO>> cercaProdottiPaginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String nome
    ) {
        Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Il service deve restituire una Page di DTO, oppure mappiamo qui:
        Page<ProdottoResponseDTO> prodottiDTO = prodottoService.ricercaAvanzata(nome, pageable)
                .map(prodotto -> new ProdottoResponseDTO(
                        prodotto.getId(),
                        prodotto.getNome(),
                        prodotto.getPrezzo(),
                        prodotto.getQuantita(),
                        prodotto.isDisponibile(),
                        prodotto.getCategoria() != null ? prodotto.getCategoria().getNome() : "Nessuna"
                ));

        return ResponseEntity.ok(prodottiDTO);
    }


    // ----------------------------------------------------------------------------------
    // 1. GET ALL: Restituisce la lista di tutti i prodotti (HTTP GET)
    // ----------------------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Prodotto>> getAllProdotti() {
        List<Prodotto> prodotti = prodottoService.getAllProdotti();
        return ResponseEntity.ok(prodotti); // Status Code 200 OK
    }

    // ----------------------------------------------------------------------------------
    // 2. GET BY ID: Restituisce un singolo elemento (HTTP GET)
    // ----------------------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Prodotto> getProdottoById(@PathVariable Long id) {
        return prodottoService.getProdottoById(id)
                .map(prod -> ResponseEntity.ok(prod)) // 200 OK se trovato
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found se non esiste
    }

    // ----------------------------------------------------------------------------------
    // 3. CREATE: Crea un nuovo elemento dal Body della richiesta (HTTP POST)
    // ----------------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Prodotto> createProdotto(@RequestBody Prodotto nuovoProdotto) {
        // @RequestBody converte automaticamente il JSON ricevuto dal frontend in un oggetto Java
        Prodotto prodottoSalvato = prodottoService.saveProdotto(nuovoProdotto);
        return ResponseEntity.status(HttpStatus.CREATED).body(prodottoSalvato); // Status Code 201 Created
    }

    // ----------------------------------------------------------------------------------
    // 4. UPDATE COMPLETO: Sovrascrive un elemento esistente (HTTP PUT)
    // ----------------------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Prodotto> updateProdotto(@PathVariable Long id, @RequestBody Prodotto dettagliAggiornati) {
        return prodottoService.getProdottoById(id)
                .map(prodEsistente -> {
                    // Aggiorniamo i campi dell'oggetto esistente con i nuovi dati
                    prodEsistente.setNome(dettagliAggiornati.getNome());
                    prodEsistente.setPrezzo(dettagliAggiornati.getPrezzo());
                    prodEsistente.setQuantita(dettagliAggiornati.getQuantita());
                    prodEsistente.setDisponibile(dettagliAggiornati.getDisponibile());

                    Prodotto salvato = prodottoService.saveProdotto(prodEsistente);
                    return ResponseEntity.ok(salvato);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ----------------------------------------------------------------------------------
    // 5. UPDATE PARZIALE / AZIONE: Cambia solo lo stato (HTTP PATCH o POST)
    // ----------------------------------------------------------------------------------
    @PatchMapping("/{id}/stato")
    public ResponseEntity<Prodotto> cambiaStato(@PathVariable Long id, @RequestParam Boolean disponibile) {
        // Esempio URL: PATCH http://localhost:8090/api/prodotti/5/stato?disponibile=false
        return prodottoService.cambiaDisponibilita(id, disponibile)
                .map(prod -> ResponseEntity.ok(prod))
                .orElse(ResponseEntity.notFound().build());
    }

    // ----------------------------------------------------------------------------------
    // 6. DELETE: Elimina un elemento (HTTP DELETE)
    // ----------------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdotto(@PathVariable Long id) {
        if (prodottoService.deleteProdotto(id)) {
            return ResponseEntity.noContent().build(); // Status Code 204 No Content (cancellazione avvenuta)
        }
        return ResponseEntity.notFound().build(); // 404 se l'ID non è stato trovato
    }

    // ==================================================================================
    // 🛠️ CASI DI MODIFICA ALL'ESAME:
    //
    // CASO A: Ricevere un parametro nell'URL tramite Query Param invece che PathVariable
    //         Es: GET http://localhost:8090/api/prodotti/cerca?nome=Mela
    //
    // @GetMapping("/cerca")
    // public ResponseEntity<List<Prodotto>> cercaPerNome(@RequestParam String nome) {
    //     return ResponseEntity.ok(prodottoRepository.findByNomeContainingIgnoreCase(nome));
    // }
    //
    // CASO B: Gestione di eccezioni personalizzate (es. Risposta 400 Bad Request se i dati sono errati)
    //
    // @PostMapping("/sicuro")
    // public ResponseEntity<?> creaConControllo(@RequestBody Prodotto prod) {
    //     if (prod.getPrezzo() < 0) {
    //         return ResponseEntity.badRequest().body("Il prezzo non può essere negativo!");
    //     }
    //     return ResponseEntity.ok(prodottoService.saveProdotto(prod));
    // }
    // ==================================================================================



}