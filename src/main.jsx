import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/common.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import './api/apiInterceptor';
import { ProfileProvider } from '@/hooks/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </StrictMode>
);
