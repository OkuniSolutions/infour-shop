import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importar estilos personalizados
import './assets/css/custom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)