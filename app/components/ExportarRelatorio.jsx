import React from "react";

export default function ExportarRelatorio({ token }) {
  // Exporta diárias/viagens em Excel usando rota backend
  function handleExportExcel() {
    window.open("/export/excel", "_blank");
  }

  // Relatórios PDF podem ser abertos por outros endpoints (backend precisa implementar)
  function handleExportPdf(tipo) {
    window.open(`/api/relatorio-pdf/${tipo}`, "_blank");
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header"><h5><i className="fas fa-file-export"></i> Exportação de Relatórios</h5></div>
        <div className="card-body d-flex gap-3">
          <button className="btn btn-success" onClick={handleExportExcel}>
            <i className="fas fa-file-excel me-2"></i> Exportar Excel Diárias/Viagens
          </button>
          <button className="btn btn-danger" onClick={() => handleExportPdf("produtividade")}>
            <i className="fas fa-file-pdf me-2"></i> PDF Produtividade
          </button>
          <button className="btn btn-warning" onClick={() => handleExportPdf("paralizacoes")}>
            <i className="fas fa-file-pdf me-2"></i> PDF Paralizações
          </button>
          <button className="btn btn-info" onClick={() => handleExportPdf("chuvas")}>
            <i className="fas fa-file-pdf me-2"></i> PDF Chuvas
          </button>
        </div>
      </div>
    </div>
  );
}