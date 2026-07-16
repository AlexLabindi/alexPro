import { useState, useEffect } from 'react'
/*1. Cambio dei Nomi dei Campi del Form
Se l'entità è ad esempio Studente con campi nome, matricola, email:

Aggiorna lo stato formData: { nome: '', matricola: '', email: '' }.

Nel Form HTML, assicurati che la proprietà name="" di ogni <input> corrisponda esattamente al nome della variabile nell'oggetto JavaScript e nel Model Java (name="matricola").*/

function App() {
    // ==================================================================================
    // 💡 1. STATI (State Management)
    // ==================================================================================
    // Mantiene l'elenco dei prodotti recuperati dal backend
    const [prodotti, setProdotti] = useState([])

    // Stati per la gestione del ciclo di vita della richiesta HTTP
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Stato per i campi del form di inserimento (Controlled Components)
    const [formData, setFormData] = useState({
        nome: '',
        prezzo: '',
        quantita: ''
    })

    // URL Base delle API REST di Spring Boot
    const API_URL = 'http://localhost:8090/api/prodotti'

    // ==================================================================================
    // 🔄 2. CARICAMENTO INIZIALE (Read - GET)
    // ==================================================================================
    /**
     * useEffect con array di dipendenze vuoto [] viene eseguito UNA SOLA VOLTA
     * al montaggio del componente (componentDidMount).
     */
    useEffect(() => {
        fetchProdotti()
    }, [])

    const fetchProdotti = () => {
        setLoading(true)
        setError(null)

        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error('Impossibile connettersi al server Backend')
                return res.json()
            })
            .then(data => {
                setProdotti(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }

    // ==================================================================================
    // ➕ 3. INSERIMENTO NUOVO ELEMENTO (Create - POST)
    // ==================================================================================
    const handleInputChange = (e) => {
        const { name, value } = e.target
        // Aggiorniamo dinamicamente solo il campo modificato mantenendo gli altri (spread operator)
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault() // Evita il ricaricamento della pagina HTML standard

        // Validazione base lato client
        if (!formData.nome || !formData.prezzo) {
            alert('Inserisci nome e prezzo del prodotto!')
            return
        }

        // Costruiamo l'oggetto da inviare corrispondente al Model Java
        const nuovoProdotto = {
            nome: formData.nome,
            prezzo: parseFloat(formData.prezzo),
            quantita: parseInt(formData.quantita) || 0,
            disponibile: true
        }

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Avvisa Spring Boot che inviamo un JSON
            },
            body: JSON.stringify(nuovoProdotto)
        })
            .then(res => {
                if (!res.ok) throw new Error("Errore durante il salvataggio del prodotto")
                return res.json()
            })
            .then(prodottoCreato => {
                // 💡 AGGIORNAMENTO IMMUTABILE: Aggiungiamo il nuovo elemento in testa all'array esistente
                setProdotti(prev => [prodottoCreato, ...prev])
                // Resettiamo i campi del form
                setFormData({ nome: '', prezzo: '', quantita: '' })
            })
            .catch(err => setError(err.message))
    }

    // ==================================================================================
    // ⚡ 4. CAMBIO STATO DINAMICO (Update - PATCH)
    // ==================================================================================
    const handleToggleStato = (id, statoAttuale) => {
        const nuovoStato = !statoAttuale

        // Inviamo la richiesta PATCH usando i Query Parameters (es. ?disponibile=false)
        fetch(`${API_URL}/${id}/stato?disponibile=${nuovoStato}`, {
            method: 'PATCH'
        })
            .then(res => {
                if (!res.ok) throw new Error("Impossibile aggiornare lo stato del prodotto")
                return res.json()
            })
            .then(prodottoAggiornato => {
                /*
                 * 💡 OTTIMIZZAZIONE REACT: Usiamo .map() per sostituire esclusivamente
                 * l'oggetto modificato mantenendo inalterati gli altri.
                 */
                setProdotti(prev =>
                    prev.map(p => p.id === id ? prodottoAggiornato : p)
                )
            })
            .catch(err => setError(err.message))
    }

    // ==================================================================================
    // 🗑️ 5. CANCELLAZIONE (Delete - DELETE)
    // ==================================================================================
    const handleDelete = (id) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return

        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (!res.ok) throw new Error("Errore durante la cancellazione")

                // 💡 AGGIORNAMENTO IMMUTABILE: Rimuoviamo l'elemento dall'array usando .filter()
                setProdotti(prev => prev.filter(p => p.id !== id))
            })
            .catch(err => setError(err.message))
    }

    // ==================================================================================
    // 🎨 6. RENDERING INTERFACCIA (JSX)
    // ==================================================================================
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 font-sans">

            {/* HEADER */}
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
                    📦 Gestionale Prodotti alexPro
                </h1>
                <p className="mt-2 text-slate-600">
                    Architettura Full-Stack di Riferimento (Spring Boot + React)
                </p>
            </header>

            {/* BANNER DI ERRORE */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4 shadow-sm flex justify-between items-center">
                    <p className="text-red-700 font-medium">⚠️ {error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-500 font-bold hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FORM DI INSERIMENTO (Colonna Sinistra) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        ➕ Nuovo Prodotto
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Nome Prodotto *
                            </label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                placeholder="Es. Tastiera Meccanica"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Prezzo (€) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="prezzo"
                                value={formData.prezzo}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Quantità Iniziale
                            </label>
                            <input
                                type="number"
                                name="quantita"
                                value={formData.quantita}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer shadow-sm"
                        >
                            Salva Prodotto
                        </button>
                    </form>
                </div>

                {/* TABELLA E LISTA PRODOTTI (Colonna Destra) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            📋 Elenco Prodotti ({prodotti.length})
                        </h2>
                        <button
                            onClick={fetchProdotti}
                            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                            🔄 Aggiorna
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-slate-500 text-sm">Caricamento in corso...</p>
                        </div>
                    ) : prodotti.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-400">Nessun prodotto presente nel Database.</p>
                        </div>
                    ) : (
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
                                {prodotti.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                        <td className="py-3 px-2 font-mono text-slate-400">#{p.id}</td>
                                        <td className="py-3 px-2 font-semibold text-slate-800">{p.nome}</td>
                                        <td className="py-3 px-2 font-bold text-slate-700">€ {p.prezzo?.toFixed(2)}</td>

                                        {/* Badge di Stato Cliccabile */}
                                        <td className="py-3 px-2 text-center">
                                            <button
                                                onClick={() => handleToggleStato(p.id, p.disponibile)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                                                    p.disponibile
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                }`}
                                            >
                                                {p.disponibile ? 'Disponibile' : 'Esaurito'}
                                            </button>
                                        </td>

                                        {/* Pulsante di Cancellazione */}
                                        <td className="py-3 px-2 text-right">
                                            <button
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

export default App