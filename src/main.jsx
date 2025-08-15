import { StrictMode } from 'react'
import { createRoot } from 'react-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root'),{StrictMode: true}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
