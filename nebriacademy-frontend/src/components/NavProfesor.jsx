import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'
import ImagenBotonMas from '../assets/botonMas.png'


function NavProfesor() {

    const navigate = useNavigate();
    const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
    const desplegableRef = useRef(null);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioIniciado = localStorage.getItem('usuario')
        setUsuario(JSON.parse(usuarioIniciado))
    }, []);

     const clickBtnAddCurso = () => {
        navigate('/Home/AddCurso')
    }

    const handleProfileClick = () => {
        setIsdesplegableOpen(!isdesplegableOpen);
    }

    const handleNavigateProfile = () => {
        navigate('/HomeProfesor/PerfilProfesor');
        setIsdesplegableOpen(false);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setIsdesplegableOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (desplegableRef.current && !desplegableRef.current.contains(event.target)) {
                setIsdesplegableOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


  return (
    <div className="nav">
        <a href="/HomeProfesor">
        <div className="contenedor-logo-titulo">
            <img className="logo-nav" src={Logo} alt="Logo Nebriacademy" />
            <h2>NebriAcademy</h2>
        </div>
        </a>
        <button className="boton-añadir-curso" onClick={clickBtnAddCurso}>
            <h3>Añadir curso</h3>
            <img className="icono-boton-mas" src={ImagenBotonMas} alt="Icono añadir curso" />
        </button>
        <input type="search" className="barra-busqueda-nav" placeholder="Buscar..." />
        <div className="perfil-desplegable-container" ref={desplegableRef}>
            <button 
                className="perfil-button"
                onClick={handleProfileClick}
                aria-label="Menú de perfil"
            >
                <img className="perfil-nav" src={ImagenPerfil} alt="Perfil Usuario" />
            </button>
            {isdesplegableOpen && (
                <div className="desplegable-menu">
                    <h3>{usuario.nombre} {usuario.apellidos}</h3>
                    <p>{usuario.email}</p>
                    <button className="desplegable-item" onClick={handleNavigateProfile}>
                        Mi Perfil
                    </button>
                    <button className="desplegable-item" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}

export default NavProfesor;