import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configuração global de interceptadores para API
import axios from 'axios';

// Configurar base URL da API
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || '/api';
axios.defaults.baseURL = API_BASE_URL;

// Interceptador para adicionar token automaticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar respostas e erros
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);