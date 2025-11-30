import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Configurar axios com o token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (usuario, senha) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/login', {
        usuario,
        senha
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Salvar no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Configurar axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Atualizar estado
        setUser(userData);
        
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Erro no login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Limpar estado
    setUser(null);
    setError(null);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissoes) return false;
    return user.permissoes.adm || user.permissoes[permission];
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}