import React, { useEffect, useState } from "react";

export default function MeuVeiculo({ token, user }) {
  const [dados, setDados] = useState({});
  const [viagens, setViagens] = useState([]);

  useEffect(() => {
    fetchEmpresa();
    fetchVeiculoUsuario();
  }, [token, user]);

  async function fetchEmpresa() {
    const res = await fetch("/api/empresa-config", { headers: { Authorization: `Bearer ${token}` } });
    const empresa = await res.json();
    setDados(d => ({ ...d, empresa }));
  }

  async function fetchVeiculoUsuario() {
    // Primeiro, descobre o veículo associado àquele usuário
    const res = await fetch(`/api/usuario-veiculo/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
    const veiculo = await res.json();
    setDados(d => ({ ...d, veiculo }));
    if (veiculo.id_veiculo) {
      // Depois, pega viagens daquele veículo na data atual
      const hoje = new Date().toISOString().slice(0, 10);
      const resViagem = await fetch(`/api/viagens-veiculo?data=${hoje}&veiculo_id=${veiculo.id_veiculo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setViagens(await resViagem.json());
    }
  }

  // Calcula totais das viagens do dia
  const totalViagens = viagens.reduce((a, v) => a + (v.quantidade_viagens ?? 0), 0);
  const volumeTotal = viagens.reduce((a, v) => a + (v.quantidade_viagens * (dados.veiculo?.cubagem_m3 ?? 0)), 0);

  return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
        <div>
          <i className="fas fa-user"></i> <strong>Usuário Logado:</strong> {user?.nome}
        </div>
        {dados.empresa?.logomarca && (
          <img src={dados.empresa.logomarca} alt="logo empresa" style={{ maxHeight: 40, maxWidth: 120 }} />
        )}
      </div>
      {/* Resumo Meu Veículo */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-car fa-3x text-primary mb-3"></i>
              <h4 className="text-primary">{dados.veiculo?.veiculo ?? "-"}</h4>
              <p className="text-muted">Veículo</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-route fa-3x text-success mb-3"></i>
              <h4 className="text-success">{totalViagens}</h4>
              <p className="text-muted">Viagens do Dia</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-cube fa-3x text-info mb-3"></i>
              <h4 className="text-info">{volumeTotal?.toFixed(2)}</h4>
              <p className="text-muted">Volume Total (m³)</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tabela das viagens do veículo */}
      <div className="card">
        <div className="card-header"><h6>Minhas Viagens (Hoje)</h6></div>
        <div className="card-body p-0">
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Obra</th>
                <th>Serviço</th>
                <th>Local</th>
                <th>Qtd</th>
                <th>Registrado por</th>
              </tr>
            </thead>
            <tbody>
              {viagens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Nenhuma viagem registrada nesta data</td>
                </tr>
              ) : viagens.map(v => (
                <tr key={v.id}>
                  <td>{new Date(v.data_hora).toLocaleString("pt-BR")}</td>
                  <td>{v.nome_obra}</td>
                  <td>{v.servico}</td>
                  <td>{v.local}</td>
                  <td>{v.quantidade_viagens}</td>
                  <td>{v.nome_usuario ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Config empresa */}
      {dados.empresa && (
        <div className="card mt-4">
          <div className="card-body text-center">
            <h5>{dados.empresa.nome_empresa}</h5>
            <p className="mb-1">{dados.empresa.endereco}</p>
            <p className="mb-1">{dados.empresa.telefone}</p>
            <p className="mb-0">{dados.empresa.cnpj}</p>
          </div>
        </div>
      )}
    </div>
  );
}