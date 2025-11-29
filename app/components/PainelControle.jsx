import React, { useEffect, useState } from "react";

const PERMISSOES = [
  { key: "adm", label: "ADM" },
  { key: "dashboard", label: "Dashboard" },
  { key: "registrar_viagem", label: "Registrar Viagem" },
  { key: "obras", label: "Obras" },
  { key: "veiculo", label: "Veículos" },
  { key: "profissionais", label: "Profissionais" },
  { key: "diaria", label: "Diária" },
  { key: "meu_veiculo", label: "Meu Veículo" },
  { key: "painel_controle", label: "Painel de Controle" },
  { key: "visualizar_ocorrencias_transportes", label: "Ocorrências/Transportes" },
  { key: "visualizar_clima_tempo", label: "Clima Tempo" }
];

export default function PainelControle({ token }) {
  const [profissionais, setProfissionais] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [config, setConfig] = useState({});
  const [selectedProf, setSelectedProf] = useState("");
  const [perms, setPerms] = useState({});
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Carregar profissionais, usuários e empresa
  useEffect(() => {
    fetchConf();
    fetch("/api/profissionais", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setProfissionais);
    fetch("/api/usuarios", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(us => setUsuarios(us));
  }, [token]);

  // Consultar permissões atual do profissional
  useEffect(() => {
    if (!selectedProf) return;
    fetch(`/api/usuarios/${selectedProf}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setPerms(PERMISSOES.reduce((obj, p) => ({ ...obj, [p.key]: !!data[p.key] }), {}));
        setUsuario(data.usuario || "");
        setSenha("");
      });
  }, [selectedProf, token]);

  // Carregar config empresa
  async function fetchConf() {
    try {
      const res = await fetch("/api/empresa-config", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setConfig(json || {});
    } catch { setConfig({}); }
  }

  // Salvar permissões do profissional
  async function handleSalvarPerm(e) {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const res = await fetch("/api/permissoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_profissional: Number(selectedProf),
          usuario, senha,
          ...perms
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Permissões salvas!");
    } catch (err) {
      setError(err.message);
    }
  }

  // Salvar config empresa
  async function handleSalvarConf(e) {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const res = await fetch("/api/empresa-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro");
      setMsg("Configuração salva!");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Config empresa */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h5><i className="fas fa-building"></i> Configurações da Empresa</h5></div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSalvarConf}>
                <div className="col-12">
                  <label className="form-label">Nome da Empresa</label>
                  <input type="text" className="form-control" value={config.nome_empresa || ""}
                    onChange={e => setConfig(c => ({ ...c, nome_empresa: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label">Telefone</label>
                  <input type="text" className="form-control" value={config.telefone || ""}
                    onChange={e => setConfig(c => ({ ...c, telefone: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label">CNPJ</label>
                  <input type="text" className="form-control" value={config.cnpj || ""}
                    onChange={e => setConfig(c => ({ ...c, cnpj: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label">Endereço</label>
                  <input type="text" className="form-control" value={config.endereco || ""}
                    onChange={e => setConfig(c => ({ ...c, endereco: e.target.value }))} />
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-save me-2"></i> Salvar
                  </button>
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {msg && <div className="alert alert-success mt-2">{msg}</div>}
              </form>
            </div>
          </div>
        </div>

        {/* Permissões / usuários */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h5><i className="fas fa-cogs"></i> Permissões de Profissionais</h5></div>
            <div className="card-body">
              <form className="mb-2" onSubmit={handleSalvarPerm}>
                <label className="form-label mt-2">Selecionar Profissional</label>
                <select className="form-select mb-2" value={selectedProf}
                  onChange={e => setSelectedProf(e.target.value)}>
                  <option value="">Selecione</option>
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - {p.funcao}
                    </option>
                  ))}
                </select>
                {selectedProf && (
                  <>
                    <hr />
                    <label className="form-label">Permissões</label>
                    {PERMISSOES.map(p => (
                      <div key={p.key} className="form-check form-check-inline mb-2">
                        <input className="form-check-input" type="checkbox" id={`perm_${p.key}`}
                          checked={!!perms[p.key]} onChange={e => setPerms(pr => ({ ...pr, [p.key]: e.target.checked }))} />
                        <label className="form-check-label" htmlFor={`perm_${p.key}`}>{p.label}</label>
                      </div>
                    ))}
                    <hr />
                    <div className="row mb-2">
                      <div className="col-7">
                        <label className="form-label">Usuário</label>
                        <input type="text" className="form-control" value={usuario}
                          onChange={e => setUsuario(e.target.value)} />
                      </div>
                      <div className="col-5">
                        <label className="form-label">Nova Senha</label>
                        <input type="password" className="form-control" value={senha}
                          onChange={e => setSenha(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success me-2">
                      <i className="fas fa-save"></i> Salvar Permissões
                    </button>
                  </>
                )}
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {msg && <div className="alert alert-success mt-2">{msg}</div>}
              </form>
              <h6 className="mt-4">Usuários Cadastrados</h6>
              <ul className="list-group">
                {usuarios.length === 0 && <li className="list-group-item text-muted">Nenhum usuário cadastrado</li>}
                {usuarios.map(u => (
                  <li key={u.id} className="list-group-item">
                    <strong>{u.profissional?.nome}</strong> - {u.profissional?.funcao}
                    <br /><span className="text-muted">Usuário: {u.usuario}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}