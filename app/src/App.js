import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Componentes
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

// Context para autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Adicionar outras rotas conforme necessário */}
        </Routes>
      </div>
    </div>
  );
}

export default App;