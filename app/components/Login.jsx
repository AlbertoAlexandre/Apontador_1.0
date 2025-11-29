import React, { useState } from "react";
import "./Login.css"; // Se desejar incluir estilos customizados

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro desconhecido");
      onLogin(json.token, { ...json, token: json.token });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-truck fa-3x mb-3"></i>
          <h3>APONTADOR</h3>
          <p>Sistema de Viagens</p>
        </div>
        <form className="login-body" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Usuário"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            <i className="fas fa-sign-in-alt me-2"></i> ENTRAR
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    </div>
  );
}