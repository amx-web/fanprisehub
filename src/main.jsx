import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Initialize Firebase (and Analytics) once at app startup.
import './firebaseClient'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
