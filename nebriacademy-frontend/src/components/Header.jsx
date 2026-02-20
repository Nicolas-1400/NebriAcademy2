// ==========================================
// 1. IMPORTACIONES
// ==========================================
import Logo from "../assets/nebriLogo.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Header: Componente puramente visual (Dumb Component).
// Expone el isologotipo corporativo estandarizado a lo largo del encabezado de la web.
function Header() {
  // ==========================================
  // 3. RENDERIZADO
  // ==========================================
  return (
    <header className="header">
      <div className="contenedor-header">
        <img className="logo-header" src={Logo} alt="Logo Nebriacademy" />
        <h1>NebriAcademy</h1>
      </div>
    </header>
  );
}

// ==========================================
// 4. EXPORTACIONES MÓDULO
// ==========================================
export default Header;
