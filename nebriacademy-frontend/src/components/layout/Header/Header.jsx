import Logo from "../../../assets/Icons/nebriLogo.png";

// Header estático que muestra el logo y el nombre de la aplicación.
// Solo aparece en las páginas de registro y login (antes de entrar al home).
function Header() {
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
