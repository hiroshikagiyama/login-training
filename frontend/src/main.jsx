import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UIProvider } from '@yamada-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UIProvider>
  </StrictMode>
);
