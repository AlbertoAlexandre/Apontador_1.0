import React, { useState, useEffect } from "react";

export default function Profissionais({ token }) {
  const [profs, setProfs] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    funcao: "",
    contato: "",
    email: "",
    terceirizado: false,
    empresa_terceirizada: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfs();
  }, [token]);

  async function fetchProfs() {
    try {
      const res = await fetch("/api/profissionais", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setProfs(res.ok ? json : []);
    } catch {
      setProfs([]);
    }
  }

  function handleChange(e) {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch("/api/profissionais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Profissional cadastrado!");
      setForm({
        nome: "", funcao: "", contato: "", email: "",
        terceirizado: false, empresa_terceirizada: ""
      });
      fetchProfs();
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
            <div className="card-header"><h5><i className="fas fa-user"></i> Cadastrar Profissional</h5></div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label">Nome</label>
                  <input type="text" className="form-control" name="nome"
                    value={form.nome} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Função</label>
                  <input type="text" className="form-control" name="funcao"
                    value={form.funcao} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Contato</label>
                  <input type="text" className="form-control" name="contato"
                    value={form.contato} onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email"
                    value={form.email} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" name="terceirizado"
                      checked={form.terceirizado} onChange={handleChange} id="terceirizadoCheck" />
                    <label className="form-check-label" htmlFor="terceirizadoCheck">
                      Terceirizado
                    </label>
                  </div>
                </div>
                {form.terceirizado && (
                  <div className="col-12">
                    <label className="form-label">Empresa Terceirizada</label>
                    <input type="text" className="form-control" name="empresa_terceirizada"
                      value={form.empresa_terceirizada} onChange={handleChange} />
                  </div>
                )}
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
        {/* Listagem */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6>Profissionais Cadastrados</h6></div>
            <div className="card-body">
              {profs.length === 0 ? (
                <p className="text-muted">Nenhum profissional cadastrado</p>
              ) : (
                <ul className="list-group">
                  {profs.map(p => (
                    <li key={p.id} className="list-group-item">
                      <div>
                        <strong>{p.nome}</strong>
                        <br /><small className="text-muted">Função: {p.funcao}</small>
                        {p.contato && <><br /><small className="text-muted">Contato: {p.contato}</small></>}
                        {p.email && <><br /><small className="text-muted">Email: {p.email}</small></>}
                        {p.terceirizado && (
                          <><br /><small className="text-warning">
                            Terceirizado{p.empresa_terceirizada ? ` - ${p.empresa_terceirizada}` : ""}
                          </small></>
                        )}
                      </div>
                      {/* Adicione ações de edição/exclusão se backend permitir */}
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