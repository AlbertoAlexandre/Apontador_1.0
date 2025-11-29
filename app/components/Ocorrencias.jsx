import React, { useState, useEffect } from "react";

const MOTIVOS = [
  "manutenção preventiva", "corretiva", "quebra", "abastecimento"
];
const TIPOS = [
  "mecânica", "elétrica", "hidráulica", "pneus", "outros"
];

export default function Ocorrencias({ token }) {
  const [obras, setObras] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [form, setForm] = useState({
    obra_local_id: "", veiculo_id: "", motivo_paralizacao: "",
    tipo_manutencao: "", descricao_manutencao: "",
    data_hora_inicio: "", data_hora_retorno: "",
    observacoes: "", status: "em andamento", indicador_preventiva: false
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/obras", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setObras);
    fetch("/api/veiculos", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setVeiculos);
    fetchOcorrencias();
    setForm(f => ({ ...f, data_hora_inicio: new Date().toISOString().slice(0,16) }));
  }, [token]);

  async function fetchOcorrencias() {
    try {
      const res = await fetch("/api/ocorrencias-transportes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setOcorrencias(res.ok ? json : []);
    } catch { setOcorrencias([]); }
  }

  function handleChange(e) {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/ocorrencias-transportes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Ocorrência registrada!");
      setForm({
        obra_local_id: "", veiculo_id: "", motivo_paralizacao: "",
        tipo_manutencao: "", descricao_manutencao: "",
        data_hora_inicio: new Date().toISOString().slice(0,16), data_hora_retorno: "",
        observacoes: "", status: "em andamento", indicador_preventiva: false
      });
      fetchOcorrencias();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      {/* Cadastro */}
      <div className="card mb-4">
        <div className="card-header"><h5><i className="fas fa-tools"></i> Registrar Ocorrência</h5></div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Obra/Local</label>
              <select className="form-select" name="obra_local_id"
                value={form.obra_local_id} onChange={handleChange} required>
                <option value="">Selecione uma obra</option>
                {obras.map(o => (
                  <option key={o.id} value={o.nome_obra}>{o.nome_obra}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Veículo</label>
              <select className="form-select" name="veiculo_id"
                value={form.veiculo_id} onChange={handleChange} required>
                <option value="">Selecione um veículo</option>
                {veiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.veiculo} - {v.placa}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Motivo Paralização</label>
              <select className="form-select" name="motivo_paralizacao"
                value={form.motivo_paralizacao} onChange={handleChange} required>
                <option value="">Selecione</option>
                {MOTIVOS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Tipo Manutenção</label>
              <select className="form-select" name="tipo_manutencao"
                value={form.tipo_manutencao} onChange={handleChange}>
                <option value="">Selecione</option>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Data/Hora Início</label>
              <input type="datetime-local" className="form-control" name="data_hora_inicio"
                value={form.data_hora_inicio} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data/Hora Retorno</label>
              <input type="datetime-local" className="form-control" name="data_hora_retorno"
                value={form.data_hora_retorno} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Descrição Manutenção</label>
              <textarea className="form-control" name="descricao_manutencao"
                rows={2} value={form.descricao_manutencao} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Observações</label>
              <textarea className="form-control" name="observacoes"
                rows={2} value={form.observacoes} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" name="status"
                value={form.status} onChange={handleChange}>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="indicador_preventiva"
                  checked={form.indicador_preventiva} onChange={handleChange} id="preventivaCheck" />
                <label className="form-check-label" htmlFor="preventivaCheck">
                  Manutenção Preventiva
                </label>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-save me-2"></i> Salvar Ocorrência
              </button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {msg && <div className="alert alert-success mt-2">{msg}</div>}
          </form>
        </div>
      </div>
      {/* Listagem */}
      <div className="card">
        <div className="card-header"><h6>Ocorrências Registradas</h6></div>
        <div className="card-body p-0">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Veículo</th>
                <th>Motivo</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {ocorrencias.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">Nenhuma ocorrência registrada</td></tr>
              ) : ocorrencias.map(o => (
                <tr key={o.id}>
                  <td>{new Date(o.data_hora_inicio).toLocaleString("pt-BR")}</td>
                  <td>{o.veiculo || "-"}</td>
                  <td>{o.motivo_paralizacao}</td>
                  <td>{o.tipo_manutencao}</td>
                  <td>
                    <span className={`badge bg-${o.status === "concluído" ? "success" : "warning"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{o.observacoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}