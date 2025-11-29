import React, { useEffect, useState, useRef } from "react";

// Adicione Chart.js ao seu projeto (npm i chart.js)
import Chart from "chart.js/auto";

export default function DashboardExecutivo({ token }) {
  const [kpis, setKpis] = useState({});
  const [motoristas, setMotoristas] = useState([]);
  const [frota, setFrota] = useState([]);
  const chartMotoristasRef = useRef();
  const chartFrotaRef = useRef();

  useEffect(() => {
    fetch("/api/dashboard-kpis", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setKpis);

    fetch("/api/relatorio-produtividade", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => {
        setMotoristas(data.motoristas || []);
        setFrota(data.frota || []);
      });
  }, [token]);

  // Gráfico de Produtividade por Motoristas
  useEffect(() => {
    if (!chartMotoristasRef.current || motoristas.length === 0) return;
    const labels = motoristas.map(m => m.motorista);
    const data = motoristas.map(m => m.quantidade_total);
    new Chart(chartMotoristasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Total Viagens", data, backgroundColor: "#198754" }]
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }, [motoristas]);

  // Gráfico de Frota
  useEffect(() => {
    if (!chartFrotaRef.current || frota.length === 0) return;
    const labels = frota.map(f => f.veiculo);
    const data = frota.map(f => f.total_viagens);
    new Chart(chartFrotaRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Total Viagens/Frota", data, backgroundColor: "#0d6efd" }]
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }, [frota]);

  return (
    <div className="container mt-4">
      {/* KPIs Avançados */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-exclamation-circle fa-2x text-warning mb-2"></i>
            <h4 className="text-warning">{kpis.ocorrencias_andamento ?? 0}</h4>
            <p className="text-muted">Ocorrências Ativas</p>
          </div></div>
        </div>
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-cloud-rain fa-2x text-info mb-2"></i>
            <h4 className="text-info">{kpis.chuvas_mes ?? 0}</h4>
            <p className="text-muted">Dias de Chuva (Mês)</p>
          </div></div>
        </div>
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-percentage fa-2x text-danger mb-2"></i>
            <h4 className="text-danger">{(kpis.disponibilidade_media ?? 0) + "%"}</h4>
            <p className="text-muted">Disponibilidade</p>
          </div></div>
        </div>
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-clock fa-2x text-secondary mb-2"></i>
            <h4 className="text-secondary">{(kpis.tempo_parado_medio ?? 0) + "h"}</h4>
            <p className="text-muted">Tempo Parado</p>
          </div></div>
        </div>
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
            <h4 className="text-success">{(kpis.eficiencia_media ?? 0) + "%"}</h4>
            <p className="text-muted">Eficiência</p>
          </div></div>
        </div>
        <div className="col-md-2">
          <div className="card text-center"><div className="card-body">
            <i className="fas fa-star fa-2x text-primary mb-2"></i>
            <h4 className="text-primary">{kpis.total_viagens ?? 0}</h4>
            <p className="text-muted">Total de Viagens</p>
          </div></div>
        </div>
      </div>
      {/* Gráfico Produtividade Motoristas */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Produtividade por Motorista</div>
            <div className="card-body" style={{ height: 300 }}>
              <canvas ref={chartMotoristasRef}></canvas>
            </div>
          </div>
        </div>
        {/* Gráfico Frota */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Viagens/Frota</div>
            <div className="card-body" style={{ height: 300 }}>
              <canvas ref={chartFrotaRef}></canvas>
            </div>
          </div>
        </div>
      </div>
      {/* Adicione outros gráficos/tabelas como no Python, ou KPIs extras */}
    </div>
  );
}