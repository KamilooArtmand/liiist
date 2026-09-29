import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeWorldDataDNA } from './core/seedDNA';

// Initialize the WORLD DATA DNA Engine and Graph
initializeWorldDataDNA();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
