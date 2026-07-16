import { useState, useEffect } from 'react'

function App() {
    // Stati di base universali per qualsiasi progetto
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // URL Base per l'API di Spring Boot
    const API_BASE_URL = 'http://localhost:8090/api'

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    🚀 alexPro Template Esame
                </h1>
                <p className="mt-2 text-slate-600">
                    Infrastruttura Full-Stack pronta per l'implementazione
                </p>
            </header>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <main className="bg-white rounded-2xl shadow-md p-8 border border-slate-200 min-h-[300px]">
                <p className="text-center text-slate-500">
                    Ready to code! Inserisci i tuoi componenti e le tue chiamate Fetch qui.
                </p>
            </main>
        </div>
    )
}

export default App