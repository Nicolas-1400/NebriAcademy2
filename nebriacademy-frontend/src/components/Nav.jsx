import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'


function Nav() {

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioIniciado = localStorage.getItem('usuario')
        setUsuario(JSON.parse(usuarioIniciado))
    }, []);

    const clickBtnMiEspacio = () => {
        navigate('/Home/MiEspacio')
    }

     const clickBtnCursos = () => {
        navigate('/Home/Cursos')
    }

       const clickBtnProfesores = () => {
        navigate('/Home/Profesores')
    }

       const clickBtnApuntes = () => {
        navigate('/Home/Apuntes')
    }

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleNavigateProfile = () => {
        navigate('/Home/Perfil');
        setIsDropdownOpen(false);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setIsDropdownOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


  return (
    <div className="nav">
        <a href="/Home">
        <div className="contenedor-logo-titulo">
            <img className="logo-nav" src={Logo} alt="Logo Nebriacademy" />
            <h2>NebriAcademy</h2>
        </div>
        </a>
        <div className="contenedor-botones-nav">
            <button type="button" className="boton-nav" onClick={clickBtnMiEspacio}>Mi espacio</button>
            <button type="button" className="boton-nav" onClick={clickBtnCursos}>Cursos</button>
            <button type="button" className="boton-nav" onClick={clickBtnProfesores}>Profesores</button>
            <button type="button" className="boton-nav" onClick={clickBtnApuntes}>Apuntes</button>
        </div>
        <input type="search" className="barra-busqueda-nav" placeholder="Buscar..." />
        <div className="perfil-dropdown-container" ref={dropdownRef}>
            <button 
                className="perfil-button"
                onClick={handleProfileClick}
                aria-label="Menú de perfil"
            >
                <img className="perfil-nav" src={ImagenPerfil} alt="Perfil Usuario" />
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <h3>{usuario.nombre} {usuario.apellidos}</h3>
                    <p>{usuario.email}</p>
                    <button className="dropdown-item" onClick={handleNavigateProfile}>
                        Mi Perfil
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Nav