import ExportarRelatorio from "./components/ExportarRelatorio";
import MeuVeiculo from "./components/MeuVeiculo";
// ...
case "meu-veiculo":
  content = <MeuVeiculo token={token} user={user} />;
  break;
case "exportar":
  content = <ExportarRelatorio token={token} />;
  break;