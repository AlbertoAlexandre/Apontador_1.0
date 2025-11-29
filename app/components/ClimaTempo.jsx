import React, { useState, useEffect } from "react";

const TIPOS_CHUVA = [
  { key: "fraca", label: "Fraca (Verde)" },
  { key: "moderada", label: "Moderada (Azul)" },
  { key: "forte", label: "Forte (Vermelha)" }
];

export default function ClimaTempo({ token }) {
  const [obras, setObras] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({
    data_ocorrencia: "",
    obra_local_id: "",
    tipo_chuva: "",
    hora_inicio: "",
    hora_fim: "",
    observacoes: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchObras();
    fetchRegistros();
    setForm(f => ({
      ...f,
      data_ocorrencia: new Date().toISOString().slice(0, 10)
    }));
  }, [token]);

  async function fetchObras() {
    try {
      const res = await fetch("/api/obras", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setObras(res.ok ? json : []);
    } catch { setObras([]); }
  }

  async function fetchRegistros() {
    try {
      const res = await fetch("/api/clima-tempo", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setRegistros(res.ok ? json : []);
    } catch { setRegistros([]); }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/clima-tempo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Registro salvo!");
      setForm({
        data_ocorrencia: new Date().toISOString().slice(0, 10),
        obra_local_id: "", tipo_chuva: "", hora_inicio: "", hora_fim: "", observacoes: ""
      });
      fetchRegistros();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      {/* Cadastro */}
      <div className="card mb-4">
        <div className="card-header"><h5><i className="fas fa-cloud-rain"></i> Registrar Chuva/Clima</h5></div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <label className="form-label">Data Ocorrência</label>
              <input type="date" className="form-control" name="data_ocorrencia"
                value={form.data_ocorrencia} onChange={handleChange} required />
            </div>
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
            <div className="col-md-3">
              <label className="form-label">Tipo Chuva</label>
              <select className="form-select" name="tipo_chuva"
                value={form.tipo_chuva} onChange={handleChange} required>
                <option value="">Selecione tipo</option>
                {TIPOS_CHUVA.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Hora Início</label>
              <input type="time" className="form-control" name="hora_inicio"
                value={form.hora_inicio} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Hora Fim</label>
              <input type="time" className="form-control" name="hora_fim"
                value={form.hora_fim} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Observações</label>
              <textarea className="form-control" name="observacoes"
                rows={2} value={form.observacoes} onChange={handleChange} />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-save me-2"></i> Salvar Registro
              </button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {msg && <div className="alert alert-success mt-2">{msg}</div>}
          </form>
        </div>
      </div>
      {/* Listagem */}
      <div className="card">
        <div className="card-header"><h6>Registros de Clima</h6></div>
        <div className="card-body p-0">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Data</th>
                <th>Obra</th>
                <th>Tipo Chuva</th>
                <th>Horário</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">Nenhum registro encontrado</td></tr>
              ) : registros.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.data_ocorrencia).toLocaleDateString("pt-BR")}</td>
                  <td>{r.obra_local_id || "-"}</td>
                  <td>
                    <span className={`badge bg-${r.tipo_chuva === "fraca" ? "success" : r.tipo_chuva === "moderada" ? "primary" : "danger"}`}>
                      {r.tipo_chuva}
                    </span>
                  </td>
                  <td>
                    {r.hora_inicio || "-"} {r.hora_fim && `- ${r.hora_fim}`}
                  </td>
                  <td>{r.observacoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}