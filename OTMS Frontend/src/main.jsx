import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import PropertyContextProvider from './context/PropertyContext.jsx'
import { AppProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <PropertyContextProvider>
        <App />
      </PropertyContextProvider>
    </AppProvider>
  </BrowserRouter>,

)
