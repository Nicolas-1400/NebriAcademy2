import { useNavigate } from 'react-router-dom'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'


function Nav() {

    const navigate = useNavigate();

    const clickBtnMiEspacio = () => {
        navigate('/Home/:id/MiEspacio')
    }

     const clickBtnCursos = () => {
        navigate('/Home/:id/Cursos')
    }

       const clickBtnProfesores = () => {
        navigate('/Home/:id/Profesores')
    }

       const clickBtnApuntes = () => {
        navigate('/Home/:id/Apuntes')
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
            <button type="button" className="boton-nav" onClick={clickBtnMiEspacio}>Mi Espacio</button>
            <button type="button" className="boton-nav" onClick={clickBtnCursos}>Cursos</button>
            <button type="button" className="boton-nav" onClick={clickBtnProfesores}>Profesores</button>
            <button type="button" className="boton-nav" onClick={clickBtnApuntes}>Apuntes</button>
        </div>
        <input type="search" className="barra-busqueda-nav" placeholder="Buscar..." />
        <a href="/Perfil">
            <img className="perfil-nav" src={ImagenPerfil} alt="Perfil Usuario" />
        </a>
    </div>
  )
}

export default Nav