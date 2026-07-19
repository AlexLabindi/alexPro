import React, {useState, useEffect} from 'react';

// URL base del backend gestito via Docker/Spring Boot (Porta 8090)
const API_BASE_URL = 'http://localhost:8090/api/prodotti/search';

export default function ListaProdotti() {
    // --- STATI PER LA GESTIONE DEI DATI ---
    const [prodotti, setProdotti] = useState([]);       // Contiene l'array dei prodotti della pagina corrente
    const [loading, setLoading] = useState(true);        // Stato di caricamento per l'effetto UX
    const [errore, setErrore] = useState(null);          // Stato per catturare eventuali errori di rete

    // --- STATI PER LA PAGINAZIONE E FILTRI (Corrispondono ai @RequestParam di Spring) ---
    const [paginaCorrente, setPaginaCorrente] = useState(0); // Spring indicizza le pagine partendo da 0
    const [totalePagine, setTotalePagine] = useState(0);     // Ricevuto dal metadato 'totalPages' di Spring
    const [elementiPerPagina] = useState(5);                 // Quanti record vogliamo per pagina ('size')
    const [termineRicerca, setTermineRicerca] = useState(''); // Filtro sul nome del prodotto
    const [orderBy, setOrderBy] = useState('prezzo');        // Campo per l'ordinamento ('sortBy')
    const [direzione, setDirezione] = useState('ASC');       // Direzione dell'ordinamento ('direction': ASC/DESC)

    // --- FUNZIONE DI RECUPERO DATI (FETCH) ---
    const caricaProdotti = async () => {
        setLoading(true);
        try {
            // Costruiamo la stringa di query dinamica inserendo i parametri attuali dello stato
            let url = `${API_BASE_URL}?page=${paginaCorrente}&size=${elementiPerPagina}&sortBy=${orderBy}&direction=${direzione}`;

            // Se l'utente ha digitato qualcosa nella barra di ricerca, aggiungiamo il filtro per nome
            if (termineRicerca.trim() !== '') {
                url += `&nome=${encodeURIComponent(termineRicerca)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();

            // SPIEGAZIONE ALLA COMMISSIONE:
            // Spring Boot con Page<T> non restituisce una lista semplice, ma un oggetto strutturato.
            // I dati veri stanno in 'data.content', mentre i metadati strutturali in 'data.totalPages'.
            setProdotti(data.content);
            setTotalePagine(data.totalPages);
            setErrore(null);
        } catch (err) {
            console.error("Errore durante il fetch dei dati:", err);
            setErrore("Impossibile caricare i prodotti. Controlla che il backend sia attivo.");
        } finally {
            setLoading(false);
        }
    };

    // --- USEEFFECT: REATTIVITÀ DELL'INTERFACCIA ---
    // Ogni volta che cambia la pagina, il filtro, la colonna di ordinamento o la direzione,
    // React fa ripartire automaticamente la funzione di caricamento per aggiornare i dati in tempo reale.
    useEffect(() => {
        caricaProdotti();
    }, [paginaCorrente, termineRicerca, orderBy, direzione]);

    // --- GESTIONE DEI CAMBI DI ORDINAMENTO ---
    // Cambia la colonna di ordinamento o ne inverte la direzione se ricliccata
    const gestisciOrdinamento = (colonna) => {
        if (orderBy === colonna) {
            // Se clicchiamo la stessa colonna, invertiamo la direzione
            setDirezione(direzione === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // Se cambiamo colonna, impostiamo la nuova colonna e azzeriamo in ASC
            setOrderBy(colonna);
            setDirezione('ASC');
        }
        setPaginaCorrente(0); // Buona norma: resettare alla prima pagina quando cambia l'ordine
    };

    // --- RENDER COMPONENTE ---
    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <h2>Gestione Catalogo Prodotti Avanzata</h2>

            {/* Pannello dei Filtri di Ricerca */}
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Cerca prodotto per nome..."
                    value={termineRicerca}
                    onChange={(e) => {
                        setTermineRicerca(e.target.value);
                        setPaginaCorrente(0); // Resetta alla pagina 1 quando l'utente digita una ricerca
                    }}
                    style={{padding: '8px', width: '300px', marginRight: '10px'}}
                />
                <button onClick={caricaProdotti} style={{padding: '8px 15px'}}>Aggiorna</button>
            </div>

            {/* Gestione degli stati di Loading ed Errore */}
            {loading && <p>Caricamento dati dal server PostgreSQL...</p>}
            {errore && <p style={{color: 'red'}}>{errore}</p>}

            {/* Tabella Dati */}
            {!loading && !errore && (
                <>
                    <table border="1" cellPadding="10"
                           style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                        <thead>
                        <tr style={{backgroundColor: '#f2f2f2', cursor: 'pointer'}}>
                            <th onClick={() => gestisciOrdinamento('id')}>ID {orderBy === 'id' && (direzione === 'ASC' ? '🔼' : '🔽')}</th>
                            <th onClick={() => gestisciOrdinamento('nome')}>Nome
                                Prodotto {orderBy === 'nome' && (direzione === 'ASC' ? '🔼' : '🔽')}</th>
                            {/* NUOVA COLONNA CATEGORIA */}
                            <th onClick={() => gestisciOrdinamento('categoria.nome')}>Categoria {orderBy === 'categoria.nome' && (direzione === 'ASC' ? '🔼' : '🔽')}</th>
                            <th onClick={() => gestisciOrdinamento('prezzo')}>Prezzo
                                (€) {orderBy === 'prezzo' && (direzione === 'ASC' ? '🔼' : '🔽')}</th>
                            <th>Quantità Magazzino</th>
                            <th>Stato Disponibilità</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prodotti.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center'}}>Nessun prodotto trovato.</td>
                                {/* Cambiato colSpan a 6 perché ora ci sono 6 colonne */}
                            </tr>
                        ) : (
                            prodotti.map((prodotto) => (
                                <tr key={prodotto.id}>
                                    <td>{prodotto.id}</td>
                                    <td>{prodotto.nome}</td>

                                    {/* NUOVO DATO MOSTRATO */}
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

                                    <td>{prodotto.prezzo.toFixed(2)} €</td>
                                    <td>{prodotto.quantita} unità</td>
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

                    {/* Controller della Paginazione */}
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <button
                            onClick={() => setPaginaCorrente(prev => Math.max(prev - 1, 0))}
                            disabled={paginaCorrente === 0}
                            style={{padding: '5px 10px'}}
                        >
                            ⬅️ Precedente
                        </button>

                        <span>Pagina <strong>{paginaCorrente + 1}</strong> di {totalePagine || 1}</span>

                        <button
                            onClick={() => setPaginaCorrente(prev => Math.min(prev + 1, totalePagine - 1))}
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