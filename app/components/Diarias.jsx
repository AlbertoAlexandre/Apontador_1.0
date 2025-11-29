import React, { useEffect, useState } from "react";

export default function Diarias({ token }) {
  const [diarias, setDiarias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDiarias();
  }, [token]);

  async function fetchDiarias() {
    setError("");
    try {
      const res = await fetch("/api/diarias", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao buscar diárias");
      setDiarias(json);
    } catch (err) {
      setError(err.message);
      setDiarias([]);
    }
  }

  // Render do relatório
  let totalViagens = 0;
  let totalVolume = 0;
  diarias.forEach(d => {
    totalViagens += d.total_viagens || 0;
    totalVolume += d.volume_total || 0;
  });

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5><i className="fas fa-chart-bar"></i> Relatório de Diárias</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Placa</th>
                  <th>Motorista</th>
                  <th>Cubagem (m³)</th>
                  <th>Total Viagens</th>
                  <th>Volume Total (m³)</th>
                </tr>
              </thead>
              <tbody>
                {diarias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">Nenhum registro encontrado</td>
                  </tr>
                ) : diarias.map(d => (
                  <tr key={d.id_veiculo}>
                    <td>{d.veiculo}</td>
                    <td>{d.placa}</td>
                    <td>{d.motorista}</td>
                    <td>{d.cubagem_m3}</td>
                    <td>{d.total_viagens}</td>
                    <td>{Number(d.volume_total).toFixed(2)}</td>
                  </tr>
                ))}
                {diarias.length > 0 && (
                  <tr className="table-warning fw-bold">
                    <td colSpan="4">TOTAIS</td>
                    <td>{totalViagens}</td>
                    <td>{totalVolume.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}