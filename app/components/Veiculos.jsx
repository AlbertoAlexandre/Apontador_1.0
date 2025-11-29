import React, { useState, useEffect } from "react";

export default function Veiculos({ token }) {
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [form, setForm] = useState({
    veiculo: "",
    placa: "",
    cubagem_m3: "",
    motorista: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Carrega veículos e motoristas
  useEffect(() => {
    fetchVeiculos();
    fetch("/api/profissionais", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(profs => {
        setMotoristas(profs.filter(p => p.funcao && p.funcao.toLowerCase().includes("motorista")));
      });
  }, [token]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function fetchVeiculos() {
    try {
      const res = await fetch("/api/veiculos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setVeiculos(res.ok ? json : []);
    } catch { setVeiculos([]); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/veiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          veiculo: form.veiculo,
          placa: form.placa,
          cubagem_m3: parseFloat(form.cubagem_m3),
          motorista: form.motorista
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Veículo cadastrado!");
      setForm({ veiculo: "", placa: "", cubagem_m3: "", motorista: "" });
      fetchVeiculos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Formulário de cadastro */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5><i className="fas fa-truck"></i> Cadastrar Veículo</h5>
            </div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label">Veículo</label>
                  <input type="text" className="form-control" name="veiculo"
                    value={form.veiculo} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Placa</label>
                  <input type="text" className="form-control" name="placa"
                    value={form.placa} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Cubagem (m³)</label>
                  <input type="number" min="0" step="0.01" className="form-control" name="cubagem_m3"
                    value={form.cubagem_m3} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Motorista</label>
                  <select className="form-select" name="motorista"
                    value={form.motorista} onChange={handleChange} required>
                    <option value="">Selecione um motorista</option>
                    {motoristas.map(m => (
                      <option key={m.id} value={m.nome}>{m.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i> Salvar
                  </button>
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {msg && <div className="alert alert-success mt-2">{msg}</div>}
              </form>
            </div>
          </div>
        </div>
        {/* Listagem dos veículos */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6>Veículos Cadastrados</h6></div>
            <div className="card-body">
              {veiculos.length === 0 ? (
                <p className="text-muted">Nenhum veículo cadastrado</p>
              ) : (
                <ul className="list-group">
                  {veiculos.map(v => (
                    <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{v.veiculo}</strong> - {v.placa}<br />
                        <small className="text-muted">Motorista: {v.motorista}</small><br />
                        <small className="text-muted">Cubagem: {v.cubagem_m3} m³</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}