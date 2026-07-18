import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ListaProdotti from "./ListaProdotti.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListaProdotti />
  </StrictMode>,
)
