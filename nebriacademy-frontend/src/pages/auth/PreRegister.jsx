// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Header from "../../components/layout/Header/Header.jsx";
import PreRegisterGrid from "../../components/auth/PreRegisterGrid/PreRegisterGrid.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de pre-registro: muestra el formulario de selección de rol antes del registro real
function PreRegister() {
  return (
    <div>
      <Header />
      <PreRegisterGrid />
    </div>
  );
}

export default PreRegister;
