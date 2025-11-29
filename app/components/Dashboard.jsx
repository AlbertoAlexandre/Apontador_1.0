import React, { useEffect, useState } from "react";

export default function Dashboard({ token, user, logout }) {
  const [kpis, setKpis] = useState({});

  useEffect(() => {
    fetch("/api/dashboard-kpis", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setKpis);
  }, [token]);

  // Replica cards do HTML do Flask (só KPIs iniciais)
  return (
    <div className="container mt-5">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <i className="fas fa-user"></i> <strong>Usuário Logado:</strong> {user?.nome || user?.usuario}
        </div>
        <button className="btn btn-outline-danger" onClick={logout}>Sair</button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-building fa-3x text-primary mb-3"></i>
              <h3 className="text-primary">{kpis.total_Obras ?? '...'}</h3>
              <p className="text-muted">Obras Ativas</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-truck fa-3x text-success mb-3"></i>
              <h3 className="text-success">{kpis.total_Veiculos ?? '...'}</h3>
              <p className="text-muted">Veículos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-route fa-3x text-warning mb-3"></i>
              <h3 className="text-warning">{kpis.total_Viagens ?? '...'}</h3>
              <p className="text-muted">Total de Viagens</p>
            </div>
          </div>
        </div>
        {/* Adicione mais cards conforme KPIs avançados do sistema original */}
      </div>
    </div>
  );
}