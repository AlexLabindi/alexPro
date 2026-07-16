# 🚀 alexPro — Full-Stack Exam Template

Template architetturale Full-Stack prfomante e modulare basato su **Spring Boot 3**, **React 18 (Vite + Tailwind CSS v4)** e **PostgreSQL**.

Progettato come ambiente di partenza universale, pre-configurato e pronto all'uso per lo sviluppo rapido di API REST e interfacce web reattive.

---

## 🛠️ Stack Tecnologico e Requisiti

Assicurati di avere installato sul tuo sistema i seguenti software prima di iniziare:

*   **Java Development Kit (JDK):** Versione 17 o superiore
*   **Node.js:** Versione 18.x o superiore (con `npm`)
*   **Docker & Docker Compose:** Per la gestione isolata del Database
*   **IDE consigliato:** IntelliJ IDEA / Eclipse (Backend) e VS Code (Frontend)

---

## 📁 Struttura del Progetto

```text
alexPro/
├── docker-compose.yml             # Containerization PostgreSQL
├── README.md                      # Guida operativa
├── alexPro-backend/               # Modulo Spring Boot (Porta 8090)
│   ├── src/main/java/com/alex/alexPro/
│   │   ├── controller/            # REST Controllers (@CrossOrigin)
│   │   ├── model/                 # Entità JPA / ORM
│   │   ├── repository/            # Interfacce Spring Data JPA
│   │   └── service/               # Business Logic
│   └── src/main/resources/
│       └── application.yml        # Configurazione DB & Spring
└── alexPro-frontend/              # Single Page Application React (Porta 5173)
    ├── src/
    │   ├── App.jsx                # Componente Root con fetch e UI base
    │   └── index.css              # Direttive Tailwind CSS v4
    └── package.json               # Dipendenze Frontend


PS C:\Users\39347\OneDrive\Documenti\ProgettoEsame\AlexLabindiPro> git remote remove origin
warning: more than one branch.main.remote
warning: branch.main.remote has multiple values
warning: branch.main.merge has multiple values
PS C:\Users\39347\OneDrive\Documenti\ProgettoEsame\AlexLabindiPro> git remote add origin https://github.com/AlexLabindi/alexPro.git
PS C:\Users\39347\OneDrive\Documenti\ProgettoEsame\AlexLabindiPro> git push -u origin main --force
Enumerating objects: 184, done.
Counting objects: 100% (184/184), done.
Delta compression using up to 2 threads
Compressing objects: 100% (139/139), done.
Writing objects: 100% (184/184), 69.79 KiB | 362.00 KiB/s, done.
Total 184 (delta 52), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (52/52), done.
To https://github.com/AlexLabindi/alexPro.git
 * [new branch]      main -> main
warning: branch.main.remote has multiple values
warning: branch.main.merge has multiple values
branch 'main' set up to track 'origin/main'.
PS C:\Users\39347\OneDrive\Documenti\ProgettoEsame\AlexLabindiPro> git remote -v
origin  https://github.com/AlexLabindi/alexPro.git (fetch)
origin  https://github.com/AlexLabindi/alexPro.git (push)

Annotazione,Dove si usa,A cosa serve
@Entity,Sopra la classe Model,Dice a Spring che la classe è una tabella del Database.
@Id,Sopra un campo del Model,Definisce la Chiave Primaria.
@GeneratedValue,Sopra l'ID,Gestisce l'auto-incremento dell'ID (IDENTITY).
@Autowired,Sopra le variabili nei Service/Controller,Inietta le dipendenze automaticamente.
@RestController,Sopra la classe Controller,Mappa la classe come gestione API REST (restituisce JSON).
@RequestMapping,Sopra la classe Controller,Imposta la rotta base (es. /api/prodotti).
@CrossOrigin,Sopra il Controller,Risolve il blocco CORS permettendo chiamate da React (localhost:5173).
@PathVariable,Dentro i parametri dei metodi,Cattura variabili dal path dell'URL (es. /{id}).
@RequestParam,Dentro i parametri dei metodi,Cattura parametri della query string (es. ?stato=true).
@RequestBody,Dentro i parametri dei metodi,Mappa il JSON inviato nel corpo della richiesta HTTP direttamente in un oggetto Java.