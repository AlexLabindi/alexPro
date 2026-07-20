// ==================================================================================
// 📦 IMPORTAZIONI REACT
// ==================================================================================
// useState: gestisce lo stato dei dati, della paginazione e dei filtri.
// useEffect: esegue la chiamata HTTP ogni volta che lo stato dei filtri o della pagina cambia.
import React, { useState, useEffect } from 'react';

// ==================================================================================
// 🌐 CONFIGURAZIONE ENDPOINT API
// ==================================================================================
// URL base dell'endpoint Spring Boot per la ricerca paginata e filtrata.
// ✏️ ESAME: Se l'entità cambia (es. Studente), aggiorna la rotta (es. 'http://localhost:8090/api/studenti/search')
const API_BASE_URL = 'http://localhost:8090/api/prodotti/search';

export default function ListaProdotti() {
    // ==================================================================================
    // 💡 1. STATI PER I DATI E L'INTERFACCIA UTENTE (UX)
    // ==================================================================================

    // Contiene l'array dei prodotti restituiti dal backend per la sola pagina corrente (dalla chiave JSON 'content')
    const [prodotti, setProdotti] = useState([]);

    // Indicatore booleano di caricamento per mostrare il messaggio di attesa durante la chiamata di rete
    const [loading, setLoading] = useState(true);

    // Gestore degli errori di rete o lato server (4xx / 5xx)
    const [errore, setErrore] = useState(null);

    // ==================================================================================
    // ⚙️ 2. STATI PER PAGINAZIONE E FILTRI (Parametri inviati a Spring Boot)
    // ==================================================================================

    // Spring Boot considera la prima pagina come indice 0
    const [paginaCorrente, setPaginaCorrente] = useState(0);

    // Memorizza il numero totale di pagine calcolato da Spring Boot (da 'totalPages')
    const [totalePagine, setTotalePagine] = useState(0);

    // Dimensione della pagina: quanti record richiedere per singola chiamata al parametro 'size'
    const [elementiPerPagina] = useState(5);

    // Testo digitato dall'utente nell'input di ricerca
    const [termineRicerca, setTermineRicerca] = useState('');

    // Nome della colonna su cui applicare l'ordinamento (parametro 'sortBy')
    const [orderBy, setOrderBy] = useState('prezzo');

    // Direzione dell'ordinamento: 'ASC' (Crescente) o 'DESC' (Decrescente) (parametro 'direction')
    const [direzione, setDirezione] = useState('ASC');

    // ==================================================================================
    // 🔄 3. FUNZIONE DI CARICAMENTO DATI (ASYNC / AWAIT FETCH)
    // ==================================================================================
    /**
     * Funzione asincrona che compone l'URL dinamico con query parameters e recupera i dati.
     */
    const caricaProdotti = async () => {
        setLoading(true); // Attiva lo stato di caricamento all'inizio della chiamata

        try {
            // Costruzione dinamica dell'URL tramite Template Literals (`...`)
            let url = `${API_BASE_URL}?page=${paginaCorrente}&size=${elementiPerPagina}&sortBy=${orderBy}&direction=${direzione}`;

            // Se l'utente ha inserito del testo nel filtro, aggiunge il parametro alla Query String
            if (termineRicerca.trim() !== '') {
                // encodeURIComponent previene errori in presenza di spazi o caratteri speciali
                url += `&nome=${encodeURIComponent(termineRicerca)}`;
            }

            // Esegue la richiesta HTTP GET verso Spring Boot
            const response = await fetch(url);

            // Verifica se lo status code HTTP è nella fascia 200-299
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            // Converte la risposta della promise da stringa JSON a oggetto JavaScript
            const data = await response.json();

            /*
             * 🎓 CONCETTO CHIAVE DA SPIEGARE ALLA COMMISSIONE:
             * Spring Boot quando restituisce un oggetto Page<T> non manda un array semplice [],
             * ma un payload JSON strutturato:
             * - data.content: contiene la lista dei record della pagina corrente
             * - data.totalPages: contiene il calcolo matematico delle pagine totali
             */
            setProdotti(data.content);      // Assegna l'array di DTO allo stato 'prodotti'
            setTotalePagine(data.totalPages); // Imposta il limite massimo per la paginazione
            setErrore(null);                  // Reset degli errori in caso di esito positivo

        } catch (err) {
            console.error("Errore durante il fetch dei dati:", err);
            setErrore("Impossibile caricare i prodotti. Controlla che il backend sia attivo.");
        } finally {
            setLoading(false); // Disattiva il caricamento sia in caso di successo che di errore
        }
    };

    // ==================================================================================
    // ⚡ 4. USEEFFECT (Reattività automatica dell'interfaccia)
    // ==================================================================================
    /**
     * Re-esegue caricaProdotti() ogni volta che uno dei valori nell'array delle dipendenze cambia.
     * In questo modo il filtro, il cambio pagina e l'ordinamento sono completamente automatici.
     */
    useEffect(() => {
        caricaProdotti();
    }, [paginaCorrente, termineRicerca, orderBy, direzione]); // Array delle dipendenze

    // ==================================================================================
    // 🔀 5. GESTIONE DELL'ORDINAMENTO DINAMICO
    // ==================================================================================
    /**
     * Cambia il criterio di ordinamento o inverte la direzione se la colonna è la stessa.
     */
    const gestisciOrdinamento = (colonna) => {
        if (orderBy === colonna) {
            // Se la colonna selezionata è già quella attiva, invertiamo la direzione
            setDirezione(direzione === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // Se selezioniamo una nuova colonna, impostiamo il nuovo ordinamento partendo da 'ASC'
            setOrderBy(colonna);
            setDirezione('ASC');
        }
        // BUONA NORMA UX: Resetta alla prima pagina (indice 0) per evitare di trovarsi fuori range
        setPaginaCorrente(0);
    };

    // ==================================================================================
    // 🎨 6. RENDERING JSX DELL'INTERFACCIA UTENTE
    // ==================================================================================
    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <h2>Gestione Catalogo Prodotti Avanzata</h2>

            {/* 🔍 PANNELLO DI RICERCA */}
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Cerca prodotto per nome..."
                    value={termineRicerca} // Controlled component: valore legato allo stato
                    onChange={(e) => {
                        setTermineRicerca(e.target.value); // Aggiorna lo stato del filtro
                        setPaginaCorrente(0); // Ritorna alla pagina 0 ogni volta che l'utente digita
                    }}
                    style={{padding: '8px', width: '300px', marginRight: '10px'}}
                />
                {/* Pulsante di aggiornamento manuale (opzionale) */}
                <button onClick={caricaProdotti} style={{padding: '8px 15px'}}>Aggiorna</button>
            </div>

            {/* ⚠️ MESSAGGI DI STATO UX (Loading ed Errore) */}
            {loading && <p>Caricamento dati dal server PostgreSQL...</p>}
            {errore && <p style={{color: 'red'}}>{errore}</p>}

            {/* 📊 TABELLA DATI: Renderizzata solo se il caricamento è completato senza errori */}
            {!loading && !errore && (
                <>
                    <table border="1" cellPadding="10"
                           style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>

                        {/* INTESTAZIONE TABELLA CON EVENTI CLICK PER ORDINAMENTO */}
                        <thead>
                        <tr style={{backgroundColor: '#f2f2f2', cursor: 'pointer'}}>

                            {/* Ordina per ID */}
                            <th onClick={() => gestisciOrdinamento('id')}>
                                ID {orderBy === 'id' && (direzione === 'ASC' ? '🔼' : '🔽')}
                            </th>

                            {/* Ordina per Nome */}
                            <th onClick={() => gestisciOrdinamento('nome')}>
                                Nome Prodotto {orderBy === 'nome' && (direzione === 'ASC' ? '🔼' : '🔽')}
                            </th>

                            {/* Ordina per Categoria (Relazione @ManyToOne mappata con notazione colonna.proprierà) */}
                            <th onClick={() => gestisciOrdinamento('categoria.nome')}>
                                Categoria {orderBy === 'categoria.nome' && (direzione === 'ASC' ? '🔼' : '🔽')}
                            </th>

                            {/* Ordina per Prezzo */}
                            <th onClick={() => gestisciOrdinamento('prezzo')}>
                                Prezzo (€) {orderBy === 'prezzo' && (direzione === 'ASC' ? '🔼' : '🔽')}
                            </th>

                            {/* Colonne senza ordinamento attivo */}
                            <th>Quantità Magazzino</th>
                            <th>Stato Disponibilità</th>
                        </tr>
                        </thead>

                        {/* CORPO DELLA TABELLA */}
                        <tbody>
                        {/* Controllo array vuoto: se prodotti.length è 0 mostra messaggio dedicato */}
                        {prodotti.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center'}}>Nessun prodotto trovato.</td>
                            </tr>
                        ) : (
                            /* Mappatura dell'array di DTO 'prodotti' nelle righe della tabella */
                            prodotti.map((prodotto) => (
                                <tr key={prodotto.id}> {/* Key unica basata sull'ID */}
                                    <td>{prodotto.id}</td>
                                    <td>{prodotto.nome}</td>

                                    {/* VISUALIZZAZIONE DATO DTO: Categoria estratta come stringa semplice dal DTO */}
                                    <td>
                                        <span style={{
                                            backgroundColor: '#e1f5fe',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.9em',
                                            color: '#0288d1'
                                        }}>
                                            {prodotto.nomeCategoria}
                                        </span>
                                    </td>

                                    {/* Formattazione prezzo a 2 cifre decimali */}
                                    <td>{prodotto.prezzo.toFixed(2)} €</td>
                                    <td>{prodotto.quantita} unità</td>

                                    {/* Formatting condizionale del badge booleano */}
                                    <td>
                                        <span style={{color: prodotto.disponibile ? 'green' : 'red', fontWeight: 'bold'}}>
                                            {prodotto.disponibile ? 'Disponibile' : 'Esaurito'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {/* 🎮 CONTROLLI DI PAGINAZIONE */}
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {/* Pulsante Pagina Precedente */}
                        <button
                            /* Decrementa lo stato senza scendere sotto 0 */
                            onClick={() => setPaginaCorrente(prev => Math.max(prev - 1, 0))}
                            /* Disabilitato se ci troviamo già sulla prima pagina (indice 0) */
                            disabled={paginaCorrente === 0}
                            style={{padding: '5px 10px'}}
                        >
                            ⬅️ Precedente
                        </button>

                        {/* Indicatore visivo di pagina (sommiamo +1 a paginaCorrente perché per l'utente parte da 1) */}
                        <span>Pagina <strong>{paginaCorrente + 1}</strong> di {totalePagine || 1}</span>

                        {/* Pulsante Pagina Successiva */}
                        <button
                            /* Incrementa lo stato senza superare il limite di totalePagine - 1 */
                            onClick={() => setPaginaCorrente(prev => Math.min(prev + 1, totalePagine - 1))}
                            /* Disabilitato se siamo sull'ultima pagina disponibile */
                            disabled={paginaCorrente >= totalePagine - 1}
                            style={{padding: '5px 10px'}}
                        >
                            Successiva ➡️
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}