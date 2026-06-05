// main.jsx
// Ponto de entrada da aplicação React.
// Monta o componente raiz no elemento #root do index.html.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './styles/variables.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);