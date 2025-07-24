import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Footer from './layouts/Footer.jsx'
import Header from './layouts/Header.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Header/>
      <App />
<Footer />
  </BrowserRouter>
)
