// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Logo from "../../../assets/Icons/nebriLogo.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Header estático con logo y título, usado en páginas públicas (login/registro).
function Header() {
  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <header className="header">
      <div className="header-container">
        <img className="logo-header" src={Logo} alt="Logo Nebriacademy" />
        <h1>NebriAcademy</h1>
      </div>
    </header>
  );
}

export default Header;
