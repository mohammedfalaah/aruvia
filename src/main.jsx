import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Footer from './layouts/Footer.jsx'
import Header from './layouts/Header.jsx'
import { Context_provider } from './services/Context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Context_provider>
<Header/>
      <App />
<Footer />
  </Context_provider>
   
  </BrowserRouter>
)
