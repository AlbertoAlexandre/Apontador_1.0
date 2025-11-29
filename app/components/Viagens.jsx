import React, { useEffect, useState } from "react";

export default function Viagens({ token, user }) {
  const [obras, setObras] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [viagens, setViagens] = useState([]);
  const [form, setForm] = useState({
    obraId: "",
    veiculoId: "",
    motorista: "",
    data_hora: "",
    quantidade_viagens: 1,
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Carrega obras, veículos, motoristas, viagens do usuário
  useEffect(() => {
    fetch("/api/obras", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setObras);

    fetch("/api/veiculos", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setVeiculos);

    fetch("/api/profissionais", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(profList => {
        setMotoristas(
          profList.filter(p => p.funcao && p.funcao.toLowerCase().includes("motorista"))
        );
      });

    fetch("/api/viagens", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(vs => {
        setViagens(vs.filter(v => v.usuarioId === user.id));
      });

    // Seta data/hora default agora
    setForm(f => ({ ...f, data_hora: new Date().toISOString().slice(0,16) }));
  }, [token, user]);

  // Atualiza form
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Cadastra viagem
  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/viagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          obraId: Number(form.obraId),
          veiculoId: Number(form.veiculoId),
          usuarioId: user.id,
          nome_usuario: user.nome,
          data_hora: form.data_hora,
          quantidade_viagens: Number(form.quantidade_viagens),
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg("Viagem registrada!");
      setForm(f => ({ ...f, quantidade_viagens: 1 }));
      // Recarrega viagens
      fetch("/api/viagens", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(vs => {
          setViagens(vs.filter(v => v.usuarioId === user.id));
        });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">
          <h5><i className="fas fa-plus-circle"></i> Registrar Nova Viagem</h5>
        </div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <label className="form-label">Obra</label>
              <select
                className="form-select" name="obraId" value={form.obraId}
                onChange={handleChange} required
              >
                <option value="">Selecione uma obra</option>
                {obras.map(o => (
                  <option key={o.id} value={o.id}>{o.nome_obra}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Serviço</label>
              <input
                type="text" className="form-control" name="servico" readOnly
                value={obras.find(x => x.id === Number(form.obraId))?.servico || ""}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Local</label>
              <input
                type="text" className="form-control" name="local" readOnly
                value={obras.find(x => x.id === Number(form.obraId))?.local || ""}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Veículo</label>
              <select
                className="form-select" name="veiculoId" value={form.veiculoId}
                onChange={handleChange} required
              >
                <option value="">Selecione um veículo</option>
                {veiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.veiculo} - {v.placa}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Motorista</label>
              <select
                className="form-select" name="motorista" value={form.motorista}
                onChange={handleChange} required
              >
                <option value="">Selecione um motorista</option>
                {motoristas.map(m => (
                  <option key={m.id} value={m.nome}>{m.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Data/Hora</label>
              <input
                type="datetime-local" className="form-control" name="data_hora"
                value={form.data_hora} onChange={handleChange} required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Quantidade</label>
              <input
                type="number" min="1" className="form-control" name="quantidade_viagens"
                value={form.quantidade_viagens} onChange={handleChange} required
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button type="submit" className="btn btn-success w-100">
                <i className="fas fa-save"></i> Salvar Viagem
              </button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {msg && <div className="alert alert-success mt-3">{msg}</div>}
          </form>
        </div>
      </div>
      {/* Tabela viagens do usuário */}
      <div className="card">
        <div className="card-header"><h6>Minhas Viagens Recentes</h6></div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Serviço</th>
                <th>Local</th>
                <th>Veículo</th>
                <th>Hora</th>
                <th>Qtd</th>
              </tr>
            </thead>
            <tbody>
              {viagens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Nenhuma viagem registrada</td>
                </tr>
              ) : viagens.map(v => (
                <tr key={v.id}>
                  <td>{v.obra.nome_obra}</td>
                  <td>{v.obra.servico}</td>
                  <td>{v.obra.local}</td>
                  <td>{v.veiculo.veiculo} - {v.veiculo.placa}</td>
                  <td>{new Date(v.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{v.quantidade_viagens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}