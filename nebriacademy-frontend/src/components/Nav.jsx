import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'
import ImagenBotonMas from '../assets/botonMas.png'
import useAuthStore from '../store/useAuthStore'


function Nav() {

    const navigate = useNavigate();
    const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
    const desplegableRef = useRef(null);
    const usuario = useAuthStore(state => state.user)
    const tipo = useAuthStore(state => state.tipo)
    const logoutStore = useAuthStore(state => state.logout)


    const handleProfileClick = () => {
        setIsdesplegableOpen(!isdesplegableOpen);
    }

    const handleNavigateProfile = () => {
        navigate('/Home/Perfil');
        setIsdesplegableOpen(false);
    }

    const handleLogout = () => {
        logoutStore();
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
        <div
            role="button"
            tabIndex={0}
            className="contenedor-logo-titulo"
            onClick={() => navigate('/Home')}
        >
            <img className="logo-nav" src={Logo} alt="Logo Nebriacademy" />
            <h2>NebriAcademy</h2>
        </div>

        {tipo === "profesor" ? (
            <div className="contenedor-elementos-nav-profesor">
                <button type="button" className="boton-nav" onClick={() => navigate('/Home/Apuntes')}>Apuntes</button>
                <button className="boton-añadir-curso" onClick={() => navigate('/Home/AddCurso')}>
                    <img className="icono-boton-mas" src={ImagenBotonMas} alt="Icono añadir curso" />
                    <h3>Añadir curso</h3>
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
                            <h3>{usuario?.nombre} {usuario?.apellidos}</h3>
                            <p>{usuario?.email}</p>
                            <button className="desplegable-item" onClick={handleNavigateProfile}>Mi Perfil</button>
                            <button className="desplegable-item" onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <>
                <div className="contenedor-botones-nav">
                    <button type="button" className="boton-nav" onClick={() => navigate('/Home/MiEspacio')}>Mi espacio</button>
                    <button type="button" className="boton-nav" onClick={() => navigate('/Home/Cursos')}>Cursos</button>
                    <button type="button" className="boton-nav" onClick={() => navigate('/Home/Profesores')}>Profesores</button>
                    <button type="button" className="boton-nav" onClick={() => navigate('/Home/Apuntes')}>Apuntes</button>
                </div>
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
                            <h3>{usuario?.nombre} {usuario?.apellidos}</h3>
                            <p>{usuario?.email}</p>
                            <button className="desplegable-item" onClick={handleNavigateProfile}>Mi Perfil</button>
                            <button className="desplegable-item" onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </>
        )}
    </div>
  )
}

export default Nav