import React, { useEffect, useState } from "react";

export default function Obras({ token }) {
  const [obras, setObras] = useState([]);
  const [nomeObra, setNomeObra] = useState("");
  const [servico, setServico] = useState("");
  const [localObra, setLocalObra] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Carregar obras
  useEffect(() => {
    fetchObras();
  }, [token]);

  async function fetchObras() {
    setError("");
    try {
      const res = await fetch("/api/obras", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao buscar obras");
      setObras(json);
    } catch (err) {
      setError(err.message);
      setObras([]);
    }
  }

  async function handleCriarObra(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_obra: nomeObra, servico: servico, local: localObra
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg("Obra cadastrada!");
      setNomeObra(""); setServico(""); setLocalObra("");
      fetchObras();
    } catch (err) {
      setError(err.message);
    }
  }

  // Visual igual Python: form e tabela de obras
  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">
          <h5><i className="fas fa-building"></i> Cadastrar Obra</h5>
        </div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleCriarObra}>
            <div className="col-md-4">
              <label className="form-label">Nome da Obra</label>
              <input type="text" className="form-control" value={nomeObra}
                onChange={e => setNomeObra(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Serviço</label>
              <input type="text" className="form-control" value={servico}
                onChange={e => setServico(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Local</label>
              <input type="text" className="form-control" value={localObra}
                onChange={e => setLocalObra(e.target.value)} required />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save me-2"></i> Salvar
              </button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {msg && <div className="alert alert-success mt-3">{msg}</div>}
          </form>
        </div>
      </div>
      {/* Tabela de obras cadastradas */}
      <div className="card">
        <div className="card-header">
          <h6>Obras Cadastradas</h6>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Serviço</th>
                <th>Local</th>
                {/* Adicione ações/ativa conforme backend permitir */}
              </tr>
            </thead>
            <tbody>
              {obras.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">Nenhuma obra cadastrada</td>
                </tr>
              ) : obras.map(obra => (
                <tr key={obra.id}>
                  <td>{obra.nome_obra}</td>
                  <td>{obra.servico}</td>
                  <td>{obra.local}</td>
                  {/* Ações poderiam ser ativar/desativar/excluir/editar (implemente depois) */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}