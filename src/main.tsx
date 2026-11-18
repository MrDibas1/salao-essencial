import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PWAService } from './services/pwa'

// Inicializa registro do Service Worker e escuta eventos PWA
PWAService.register()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
