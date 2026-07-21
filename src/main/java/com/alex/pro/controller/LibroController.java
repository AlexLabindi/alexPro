package com.alex.pro.controller;

import com.alex.pro.model.Libro;
import com.alex.pro.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libri") // 🛣️ Prefisso comune delle rotte
@CrossOrigin(origins = "http://localhost:5173") // 🔌 Indispensabile per evitare blocchi CORS da React
public class LibroController {

    @Autowired
    private LibroService libroService;

    // ----------------------------------------------------------------------------------
    // 1. GET ALL: Restituisce la lista di tutti i prodotti (HTTP GET)
    // ----------------------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Libro>> getAllLibri() {
        List<Libro> libri = libroService.getAllLibri();
        return ResponseEntity.ok(libri); // Status Code 200 OK
    }

    // ----------------------------------------------------------------------------------
    // 2. GET BY ID: Restituisce un singolo elemento (HTTP GET)
    // ----------------------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Libro> getLibroById(@PathVariable Long id) {
        return libroService.getLibroById(id)
                .map(lib -> ResponseEntity.ok(lib))
                .orElse(ResponseEntity.notFound().build());
    }
/*
    // ----------------------------------------------------------------------------------
    // 3. CREATE: Crea un nuovo elemento dal Body della richiesta (HTTP POST)
    // ----------------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Prodotto> createProdotto(@RequestBody Prodotto nuovoProdotto) {
        // @RequestBody converte automaticamente il JSON ricevuto dal frontend in un oggetto Java
        Prodotto prodottoSalvato = libroService.saveProdotto(nuovoProdotto);
        return ResponseEntity.status(HttpStatus.CREATED).body(prodottoSalvato); // Status Code 201 Created
    }

    // ----------------------------------------------------------------------------------
    // 4. UPDATE COMPLETO: Sovrascrive un elemento esistente (HTTP PUT)
    // ----------------------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Prodotto> updateProdotto(@PathVariable Long id, @RequestBody Prodotto dettagliAggiornati) {
        return libroService.getProdottoById(id)
                .map(prodEsistente -> {
                    // Aggiorniamo i campi dell'oggetto esistente con i nuovi dati
                    prodEsistente.setNome(dettagliAggiornati.getNome());
                    prodEsistente.setPrezzo(dettagliAggiornati.getPrezzo());
                    prodEsistente.setQuantita(dettagliAggiornati.getQuantita());
                    prodEsistente.setDisponibile(dettagliAggiornati.getDisponibile());

                    Prodotto salvato = libroService.saveProdotto(prodEsistente);
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
        return libroService.cambiaDisponibilita(id, disponibile)
                .map(prod -> ResponseEntity.ok(prod))
                .orElse(ResponseEntity.notFound().build());
    }

    // ----------------------------------------------------------------------------------
    // 6. DELETE: Elimina un elemento (HTTP DELETE)
    // ----------------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdotto(@PathVariable Long id) {
        if (libroService.deleteProdotto(id)) {
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


     */
}