import Logo from '../assets/nebriLogo.png'

function Header() {
  return (
    <header className="header">
        <img className="logo-header" src={Logo} alt="Logo Nebriacademy" />
        <h1>NebriAcademy</h1>
    </header>
  )
}

export default Header