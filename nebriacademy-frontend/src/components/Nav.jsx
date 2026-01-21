import { useNavigate } from 'react-router-dom'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'


function Nav() {

    const navigate = useNavigate();

    const clickbtn1 = () => {
        navigate('/Home')
    }

     const clickbtn2 = () => {
        navigate('/Home')
    }

       const clickbtn3 = () => {
        navigate('/Home')
    }

       const clickbtn4 = () => {
        navigate('/Home')
    }


  return (
    <div className="nav">
        <a href="/Home">
        <div className="contenedor-logo-titulo">
            <img className="logo-nav" src={Logo} alt="Logo Nebriacademy" />
            <h2>NebriAcademy</h2>
        </div>
        </a>
        <div className="contenedor-botones-nav">
            <button type="button" className="boton-nav-1" onClick={clickbtn1}>Botón 1</button>
            <button type="button" className="boton-nav-2" onClick={clickbtn2}>Botón 2</button>
            <button type="button" className="boton-nav-3" onClick={clickbtn3}>Botón 3</button>
            <button type="button" className="boton-nav-4" onClick={clickbtn4}>Botón 4</button>
        </div>
        <input type="search" className="barra-busqueda-nav" placeholder="Buscar..." />
        <a href="/Perfil">
            <img className="perfil-nav" src={ImagenPerfil} alt="Perfil Usuario" />
        </a>
    </div>
  )
}

export default Nav