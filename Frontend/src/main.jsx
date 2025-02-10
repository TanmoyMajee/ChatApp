import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes';
import { UserProvider } from './contextAPI/UserContext';
import { ChatProvider } from './contextApi/ChatProvider'
// import 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <ThemeProvider attribute="class">
      <UserProvider>
        <ChatProvider>
    <App />
    </ChatProvider>
    </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
