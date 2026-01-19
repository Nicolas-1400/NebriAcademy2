import Logo from '../assets/nebriLogo.png'

function Header() {
  return (
    <header className="header">
        <div className="contenedor-header">
            <img className="logo-header" src={Logo} alt="Logo Nebriacademy" />
            <h1>NebriAcademy</h1>
        </div>
    </header>
  )
}

export default Header