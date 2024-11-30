import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UIProvider } from '@yamada-ui/react';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </StrictMode>
);
