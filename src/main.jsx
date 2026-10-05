import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ApiProvider } from './context/ApiContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ApiProvider>
        <App />
      </ApiProvider>
    </ErrorBoundary>
  </StrictMode>
);
