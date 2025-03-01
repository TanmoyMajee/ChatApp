
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from './contextAPI/UserContext';
import { ChatProvider } from './contextApi/ChatProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider attribute="class">
      <UserProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </UserProvider>
    </ThemeProvider>
  </BrowserRouter>
);
