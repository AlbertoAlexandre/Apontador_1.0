import React from "react";

const MENUS = [
  { key: "dashboard", label: "Dashboard", icon: "fa-tachometer-alt", perm: "dashboard" },
  { key: "viagens", label: "Registrar Viagem", icon: "fa-plus-circle", perm: "registrar_viagem" },
  { key: "obras", label: "Obras", icon: "fa-building", perm: "obras" },
  { key: "veiculos", label: "Veículos", icon: "fa-truck", perm: "veiculo" },
  { key: "profissionais", label: "Profissionais", icon: "fa-users", perm: "profissionais" },
  { key: "diarias", label: "Diárias", icon: "fa-chart-bar", perm: "diaria" },
  // Adicione as demais seções do original
];

export default function Sidebar({ user, permissoes, selected, onSelect, logout }) {
  return (
    <div className="sidebar" style={{
      width: 250, position: "fixed", top: 0, left: 0, height: "100vh",
      background: "linear-gradient(135deg, #2c3e50, #34495e)", color: "#fff", zIndex: 100
    }}>
      <div className="sidebar-header p-3 border-bottom">
        <h4><i className="fas fa-truck"></i> APONTADOR</h4>
        <small>Sistema de Viagens</small>
      </div>
      <ul className="list-unstyled sidebar-menu">
        {MENUS.map(menu => (permissoes[menu.perm] || permissoes.adm) && (
          <li key={menu.key} className={selected === menu.key ? "bg-primary" : ""}>
            <a
              style={{
                display: "block", padding: "15px 20px",
                color: selected === menu.key ? "#fff" : "#ddd", fontWeight: 600, textDecoration: "none"
              }}
              onClick={() => onSelect(menu.key)}
              href="#"
            >
              <i className={`fas ${menu.icon} me-2`}></i>{menu.label}
            </a>
          </li>
        ))}
        <li>
          <a style={{ display: "block", padding: "15px 20px", color: "#fff" }} onClick={logout} href="#">
            <i className="fas fa-sign-out-alt me-2"></i>Sair
          </a>
        </li>
      </ul>
    </div>
  );
}