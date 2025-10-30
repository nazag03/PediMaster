import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Main from './Pages/Main.jsx'
import Head from './Pages/Head.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Head/>
     <Main/> 
     <App />
  </StrictMode>,
)
