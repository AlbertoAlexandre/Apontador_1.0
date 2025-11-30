import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, error } = useAuth();

  // Se já estiver logado, redirecionar
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!usuario || !senha) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const result = await login(usuario, senha);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-truck fa-3x text-primary mb-3"></i>
                  <h2 className="fw-bold text-dark">APONTADOR</h2>
                  <p className="text-muted">Sistema de Viagens</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">
                      <i className="fas fa-user me-2"></i>Usuário
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      placeholder="Digite seu usuário"
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="senha" className="form-label">
                      <i className="fas fa-lock me-2"></i>Senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Digite sua senha"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Entrar
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Usuário padrão: <strong>adm</strong> | Senha: <strong>123</strong>
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-white">
                <i className="fas fa-shield-alt me-1"></i>
                Sistema seguro e confiável
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;