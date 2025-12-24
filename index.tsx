import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountNode = document.getElementById('root');

if (!mountNode) {
  throw new Error("Não foi possível encontrar o elemento root no HTML");
}

try {
  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro ao renderizar a aplicação:", error);
  mountNode.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">Erro ao carregar aplicação. Verifique o console.</div>`;
}