// ==================================================================================
// 📦 IMPORTAZIONI DALLA LIBRERIA REACT
// ==================================================================================
// useState: hook per gestire lo stato interno dei dati nel componente.
// useEffect: hook per gestire gli "side effects" (es. chiamate HTTP al caricamento).
import { useState, useEffect } from 'react'

/*
 * 🎓 PRONTUARIO D'ESAME - SE L'ENTITÀ CAMBIA (es. da Prodotto a Studente):
 * 1. Cambia il nome degli stati e dell'oggetto formData.
 * 2. Cambia l'URL dell'API endpoint (es. http://localhost:8090/api/studenti).
 * 3. Cambia le chiavi dei campi del Form per fare il matching con il Model Java.
 */

function App() {
    // ==================================================================================
    // 💡 1. STATI (State Management)
    // ==================================================================================

    // 📌 STATO LISTA PRINCIPALE: Contiene l'array dei dati scaricati dal backend.
    // Inizializzato come array vuoto [] per evitare errori .map() al primo render.
    // ✏️ ESAME: Se l'entità è Studente -> const [studenti, setStudenti] = useState([])
    const [prodotti, setProdotti] = useState([])

    // 📌 STATO UX (Loading): Booleano per indicare al frontend se la richiesta HTTP è in corso.
    const [loading, setLoading] = useState(true)

    // 📌 STATO GESTIONE ERRORI: Memorizza la stringa di errore se la chiamata HTTP fallisce.
    const [error, setError] = useState(null)

    // 📌 STATO DEL FORM (Controlled Component):
    // Un unico oggetto JavaScript raccoglie i valori di tutti i campi dell'input.
    // ✏️ ESAME: Sostituisci i campi con quelli del DTO/Model Java (es. { nome: '', matricola: '', email: '' })
    const [formData, setFormData] = useState({
        nome: '',
        prezzo: '',
        quantita: ''
    })

    // 📌 URL BASE DELL'API REST:
    // Indirizzo dell'endpoint esposto dal Controller di Spring Boot su Docker o locale.
    // ✏️ ESAME: Cambia '/api/prodotti' con l'endpoint richiesto dalla traccia (es. '/api/studenti')
    const API_URL = 'http://localhost:8090/api/prodotti'

    // ==================================================================================
    // 🔄 2. CARICAMENTO INIZIALE (Read - HTTP GET)
    // ==================================================================================
    /**
     * Hook useEffect: viene eseguito quando il componente viene disegnato nello schermo.
     * L'array di dipendenze vuoto `[]` alla fine fa in modo che la chiamata venga
     * eseguita UNA SOLA VOLTA (equivale al vecchio componentDidMount).
     */
    useEffect(() => {
        fetchProdotti() // Esegue la chiamata GET all'avvio
    }, [])

    // Funzione che effettua la richiesta HTTP GET per recuperare la lista dal backend
    const fetchProdotti = () => {
        setLoading(true)  // Mostra lo spinner di caricamento
        setError(null)    // Azzera eventuali errori precedenti

        fetch(API_URL)    // Effettua la richiesta GET verso Spring Boot
            .then(res => {
                // Se lo status HTTP non è 2xx (es. 404 Not Found o 500 Server Error)
                if (!res.ok) throw new Error('Impossibile connettersi al server Backend')
                return res.json() // Converte la risposta HTTP in un oggetto JSON JavaScript
            })
            .then(data => {
                setProdotti(data)  // Salva i dati ricevuti nello stato 'prodotti'
                setLoading(false)  // Nasconde lo spinner di caricamento
            })
            .catch(err => {
                setError(err.message) // In caso di eccezione salva il messaggio di errore
                setLoading(false)     // Disattiva lo spinner
            })
    }

    // ==================================================================================
    // ➕ 3. INSERIMENTO NUOVO ELEMENTO (Create - HTTP POST)
    // ==================================================================================

    /**
     * Gestore dinamico per tutti i campi di testo del Form.
     * Estrae 'name' e 'value' dal tag <input> che ha scatenato l'evento 'onChange'.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target // Destrutturazione dell'evento HTML

        // Aggiorna lo stato preservando le altre chiavi grazie allo Spread Operator (...)
        setFormData(prev => ({
            ...prev,        // Mantiene inalterati i campi non modificati
            [name]: value   // Sovrascrive solo il campo con la proprietà 'name' uguale a quella del tag input
        }))
    }

    /**
     * Gestore dell'invio del modulo (Submit del Form)
     */
    const handleSubmit = (e) => {
        e.preventDefault() // BLOCCA il comportamento di default di HTML (che ricaricherebbe la pagina intera)

        // Validazione preventiva lato client per evitare chiamate a vuoto
        // ✏️ ESAME: Adatta i controlli in base ai campi obbligatori
        if (!formData.nome || !formData.prezzo) {
            alert('Inserisci nome e prezzo del prodotto!')
            return // Interrompe l'esecuzione della funzione
        }

        // Costruiamo il DTO/Payload da inviare nel Body della richiesta POST.
        // Convertiamo i tipi di dato per farli coincidere con le classi Java del backend.
        const nuovoProdotto = {
            nome: formData.nome,
            prezzo: parseFloat(formData.prezzo),               // Converte la stringa dell'input in float
            quantita: parseInt(formData.quantita) || 0,        // Converte in int (default 0 se vuoto)
            disponibile: true                                  // Default iniziale
        }

        // Effettuiamo la chiamata POST
        fetch(API_URL, {
            method: 'POST',                                    // Specifica il metodo HTTP POST
            headers: {
                'Content-Type': 'application/json'            // Informa Spring Boot che il corpo è un JSON valido
            },
            body: JSON.stringify(nuovoProdotto)               // Trasforma l'oggetto JS in stringa JSON
        })
            .then(res => {
                if (!res.ok) throw new Error("Errore durante il salvataggio del prodotto")
                return res.json() // Spring restituisce l'oggetto creato comprensivo di ID generato dal DB
            })
            .then(prodottoCreato => {
                // 💡 AGGIORNAMENTO IMMUTABILE DELLO STATO:
                // Usiamo lo Spread Operator per inserire il nuovo record IN TESTA all'array senza ricaricare la pagina dal DB.
                setProdotti(prev => [prodottoCreato, ...prev])

                // Resettiamo tutti i campi dell'input del form riportandoli a stringa vuota
                setFormData({ nome: '', prezzo: '', quantita: '' })
            })
            .catch(err => setError(err.message)) // Gestisce eventuali errori
    }

    // ==================================================================================
    // ⚡ 4. AGGIORNAMENTO PARZIALE DI STATO (Update - HTTP PATCH)
    // ==================================================================================

    /**
     * Cambia lo stato booleano (es. Disponibile/Esaurito) di una riga al click
     */
    const handleToggleStato = (id, statoAttuale) => {
        const nuovoStato = !statoAttuale // Inverte il valore booleano (true -> false, false -> true)

        // Invia una richiesta PATCH inserendo il dato come Query Parameter (?disponibile=...)
        fetch(`${API_URL}/${id}/stato?disponibile=${nuovoStato}`, {
            method: 'PATCH'
        })
            .then(res => {
                if (!res.ok) throw new Error("Impossibile aggiornare lo stato del prodotto")
                return res.json()
            })
            .then(prodottoAggiornato => {
                /*
                 * 💡 AGGIORNAMENTO REATTIVO MEDIANTE .map():
                 * Cicla l'array locale: se trova l'oggetto con l'ID modificato lo sostituisce
                 * con quello restituito dal backend, lasciando intatti tutti gli altri.
                 */
                setProdotti(prev =>
                    prev.map(p => p.id === id ? prodottoAggiornato : p)
                )
            })
            .catch(err => setError(err.message))
    }

    // ==================================================================================
    // 🗑️ 5. CANCELLAZIONE DI UN RECORD (Delete - HTTP DELETE)
    // ==================================================================================

    const handleDelete = (id) => {
        // Finestra pop-up nativa del browser per chiedere conferma all'utente
        if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return

        // Invia la richiesta HTTP DELETE indicando l'ID nel PathVariable dell'URL
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (!res.ok) throw new Error("Errore durante la cancellazione")

                // 💡 AGGIORNAMENTO IMMUTABILE MEDIANTE .filter():
                // Rimuove la riga selezionata filtrando via l'elemento con l'ID appena cancellato.
                setProdotti(prev => prev.filter(p => p.id !== id))
            })
            .catch(err => setError(err.message))
    }

    // ==================================================================================
    // 🎨 6. RENDERING INTERFACCIA GRAFICA (JSX)
    // ==================================================================================
    return (
        // Wrapper principale con classi Tailwind per formattazione e reattività layout
        <div className="max-w-5xl mx-auto px-4 py-8 font-sans">

            {/* HEADER DELL'APPLICAZIONE */}
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
                    📦 Gestionale Prodotti alexPro
                </h1>
                <p className="mt-2 text-slate-600">
                    Architettura Full-Stack di Riferimento (Spring Boot + React)
                </p>
            </header>

            {/* BANNER DINAMICO DI ERRORE: Renderizzato condizionalmente solo se 'error' ha un valore */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4 shadow-sm flex justify-between items-center">
                    <p className="text-red-700 font-medium">⚠️ {error}</p>
                    {/* Pulsante per chiudere/azzerare il messaggio di errore */}
                    <button
                        onClick={() => setError(null)}
                        className="text-red-500 font-bold hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* GRIGLIA PRINCIPALE A 2 COLONNE (Layout responsive: 1 colonna su mobile, 3 su schermi grandi) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ---------------------------------------------------------------------- */}
                {/* 📝 FORM DI INSERIMENTO (Colonna Sinistra - 1/3 della larghezza)       */}
                {/* ---------------------------------------------------------------------- */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        ➕ Nuovo Prodotto
                    </h2>

                    {/* Evento onSubmit intercettato dal metodo handleSubmit */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* CAMPO 1: Nome */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Nome Prodotto *
                            </label>
                            <input
                                type="text"
                                name="nome" // ⚠️ FONDAMENTALE: Deve corrispondere alla chiave dello stato formData!
                                value={formData.nome} // Controlled Component: legge il valore dallo stato
                                onChange={handleInputChange} // Aggiorna lo stato a ogni pressione di tasto
                                placeholder="Es. Tastiera Meccanica"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* CAMPO 2: Prezzo */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Prezzo (€) *
                            </label>
                            <input
                                type="number"
                                step="0.01" // Permette i numeri decimali con due cifre
                                name="prezzo" // ⚠️ Corrisponde a formData.prezzo
                                value={formData.prezzo}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* CAMPO 3: Quantità */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Quantità Iniziale
                            </label>
                            <input
                                type="number"
                                name="quantita" // ⚠️ Corrisponde a formData.quantita
                                value={formData.quantita}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* PULSANTE SUBMIT */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer shadow-sm"
                        >
                            Salva Prodotto
                        </button>
                    </form>
                </div>

                {/* ---------------------------------------------------------------------- */}
                {/* 📊 TABELLA E LISTA RECORD (Colonna Destra - 2/3 della larghezza)       */}
                {/* ---------------------------------------------------------------------- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            {/* Stampa dinamicamente la lunghezza dell'array prodotti */}
                            📋 Elenco Prodotti ({prodotti.length})
                        </h2>
                        {/* Pulsante per rinfrescare manualmente la tabella dal server */}
                        <button
                            onClick={fetchProdotti}
                            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                            🔄 Aggiorna
                        </button>
                    </div>

                    {/* RENDERING CONDIZIONALE A 3 LIVELLI (Loading -> Vuoto -> Tabella Dati) */}
                    {loading ? (
                        /* LIVELLO 1: Stato di caricamento (Spinner) */
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-slate-500 text-sm">Caricamento in corso...</p>
                        </div>
                    ) : prodotti.length === 0 ? (
                        /* LIVELLO 2: Messaggio quando l'array è vuoto */
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-400">Nessun prodotto presente nel Database.</p>
                        </div>
                    ) : (
                        /* LIVELLO 3: Tabella dati completa */
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                                    <th className="py-3 px-2">ID</th>
                                    <th className="py-3 px-2">Nome</th>
                                    <th className="py-3 px-2">Prezzo</th>
                                    <th className="py-3 px-2 text-center">Stato</th>
                                    <th className="py-3 px-2 text-right">Azioni</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                {/* Ciclo dell'array prodotti mediante .map() */}
                                {prodotti.map((p) => (
                                    /* ⚠️ OBBLIGATORIO: key unica basata su p.id per ottimizzare il virtual DOM di React */
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                        <td className="py-3 px-2 font-mono text-slate-400">#{p.id}</td>
                                        <td className="py-3 px-2 font-semibold text-slate-800">{p.nome}</td>
                                        {/* Optional Chaining (?.) per evitare crash se il prezzo è undefined */}
                                        <td className="py-3 px-2 font-bold text-slate-700">€ {p.prezzo?.toFixed(2)}</td>

                                        {/* BADGE DI STATO DINAMICO E CLICCABILE */}
                                        <td className="py-3 px-2 text-center">
                                            <button
                                                /* Chiama la funzione PATCH passando l'ID e lo stato attuale */
                                                onClick={() => handleToggleStato(p.id, p.disponibile)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                                                    p.disponibile
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                }`}
                                            >
                                                {/* Operatore ternario per decidere la stringa da stampare */}
                                                {p.disponibile ? 'Disponibile' : 'Esaurito'}
                                            </button>
                                        </td>

                                        {/* PULSANTE CANCELLAZIONE */}
                                        <td className="py-3 px-2 text-right">
                                            <button
                                                /* Chiama la funzione DELETE passando l'ID dell'oggetto di questa riga */
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition"
                                                title="Elimina"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

// Esporta il componente per permetterne l'importazione in main.jsx / index.js
export default App