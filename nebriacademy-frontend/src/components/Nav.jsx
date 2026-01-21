import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/nebriLogo.png'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'


function Nav() {

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleNavigateProfile = () => {
        navigate('/Perfil');
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
            <button type="button" className="boton-nav-1" onClick={clickbtn1}>Botón 1</button>
            <button type="button" className="boton-nav-2" onClick={clickbtn2}>Botón 2</button>
            <button type="button" className="boton-nav-3" onClick={clickbtn3}>Botón 3</button>
            <button type="button" className="boton-nav-4" onClick={clickbtn4}>Botón 4</button>
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