// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "../../../assets/Icons/nebriLogo.png";
import DefaultProfileImage from "../../../assets/Icons/DefaultProfileImage.png";
import { PERFILES } from "../../account/ProfileImageCard/ProfileImageCard";
import ButtonPlusIcon from "../../../assets/Icons/button-plus.png";
import HamburgerMenuIcon from "../../../assets/Icons/hamburger-menu.png";
import useAuthStore from "../../../store/useAuthStore";
import BellPending from "../../../assets/Icons/bell-pending.png";
import BellCheck from "../../../assets/Icons/bell-check.png";
import Avatar from "../../common/Avatar/Avatar";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Barra de navegación global. Contiene buscador, accesos directos y menú de usuario.
function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: usuario, tipo, logout: logoutStore, setUser } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estados de interfaz (Dropdowns y menús flotantes)
  const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificacionesOpen, setIsNotificacionesOpen] = useState(false);

  // Referencias al DOM para detectar clics fuera de los menús
  const desplegableRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const notificacionesRef = useRef(null);

  // Estados para buscador en tiempo real y notificaciones
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  
  // Caché de base de datos para búsqueda ultrarrápida en cliente
  const [dataCache, setDataCache] = useState({
    cursos: [], apuntes: [], videos: [], ejercicios: [], profesores: [],
  });

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Pre-carga de datos para el buscador (Evita llamadas API en cada pulsación)
  useEffect(() => {
    const endpoints = [
      { key: "cursos", url: `${API_URL}/cursos`, listKey: "Cursos" },
      { key: "apuntes", url: `${API_URL}/apuntes`, listKey: "Apuntes" },
      { key: "videos", url: `${API_URL}/videos`, listKey: "Videos" },
      { key: "ejercicios", url: `${API_URL}/ejercicios`, listKey: "Ejercicios" },
      { key: "profesores", url: `${API_URL}/profesores`, listKey: "Profesores" },
    ];

    // Ejecución paralela de peticiones sin bloqueo si alguna falla
    Promise.allSettled(endpoints.map((ep) => fetch(ep.url).then((res) => res.json())))
      .then((resultados) => {
        const newData = {};
        resultados.forEach((resultado, index) => {
          const ep = endpoints[index];
          newData[ep.key] = resultado.status === "fulfilled" ? resultado.value[ep.listKey] || [] : [];
        });
        setDataCache(newData);
      });
  }, []);

  // Polling/Carga inicial de notificaciones del usuario
  useEffect(() => {
    if (usuario?.usuarioId) {
      fetch(`${API_URL}/notificaciones/${usuario.usuarioId}?tipo=${tipo}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setNotificaciones(data);
        })
        .catch((err) => console.error("Error fetching notificaciones", err));
    }
  }, [usuario, tipo]);

  // Cierra menús flotantes si el usuario hace clic fuera de su área
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desplegableRef.current && !desplegableRef.current.contains(event.target)) setIsdesplegableOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".hamburger-menu-button")) setIsMenuOpen(false);
      if (notificacionesRef.current && !notificacionesRef.current.contains(event.target) && !event.target.closest(".bell-button")) setIsNotificacionesOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cierra menú hamburguesa al maximizar ventana
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768 && isMenuOpen) setIsMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Logout: Limpia Zustand y redirige al inicio
  const handleLogout = () => {
    logoutStore();
    navigate("/");
    setIsdesplegableOpen(false);
    setIsNotificacionesOpen(false);
  };

  // Intercambia el rol de la cuenta activa (Profesor <-> Alumno vinculado)
  const handleCambiarCuenta = async () => {
    try {
      const body = tipo === "profesor" ? { profesorId: usuario.id } : { alumnoId: usuario.id };
      const res = await fetch(`${API_URL}/profesores/cambiar-cuenta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const datos = await res.json();
        setUser(datos.usuario, datos.tipo);
        setIsdesplegableOpen(false);
        navigate("/Home");
      }
    } catch (err) {
      console.error("Error al cambiar cuenta:", err);
    }
  };

  // Verifica si el usuario tiene permiso para alternar rol
  const mostrarBotonCambio = tipo === "profesor" ? !!usuario?.alumnoVinculadoId : tipo === "alumno" && usuario?.esVinculado === 1;
  const textoBtnCambio = tipo === "profesor" ? "Cambiar a modo alumno" : "Cambiar a modo profesor";

  // Normaliza el campo de título según la entidad para el buscador
  const getDisplayName = (item, type) => {
    if (!item) return "";
    switch (type) {
      case "video": return item.nombre || item.titulo || "";
      case "curso": return item.nombreCurso || item.nombre || "";
      case "apunte": case "ejercicio": return item.nombre || "";
      case "profesor": return `${item.nombre || ""} ${item.apellidos || ""}`.trim();
      default: return "";
    }
  };

  // Motor de búsqueda en cliente sobre el DataCache
  const handleQueryChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (!q.trim()) {
      setSuggestions([]);
      setIsSearchOpen(false);
      return;
    }

    const qLower = q.toLowerCase();
    const results = [];

    // Helper para buscar coincidencias dentro de cada array cacheado
    const searchIn = (list, typeStr) => {
      list.forEach((item) => {
        const name = getDisplayName(item, typeStr.toLowerCase());
        if (name.toLowerCase().includes(qLower)) {
          results.push({ id: item.id, name, type: typeStr, archivo: item.archivo });
        }
      });
    };

    searchIn(dataCache.cursos, "Curso");
    searchIn(dataCache.apuntes, "Apunte");
    searchIn(dataCache.videos, "Video");
    searchIn(dataCache.ejercicios, "Ejercicio");
    searchIn(dataCache.profesores, "Profesor");

    // Limita resultados a 8 para no saturar la UI y elimina duplicados
    const unique = [];
    const seen = new Set();
    for (const r of results) {
      const key = `${r.type}-${r.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
        if (unique.length >= 8) break;
      }
    }

    setSuggestions(unique);
    setIsSearchOpen(true);
  };

  // Navega a la página correspondiente o abre el recurso directamente
  const handleSuggestionClick = (s) => {
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    setIsMenuOpen(false);

    if (s.type === "Curso") {
      navigate(`/Home/Courses/${s.id}`);
    } else if (s.type === "Profesor") {
      navigate(`/Home/Professors/${s.id}`);
    } else {
      // Abre archivos de Cloudinary en pestaña nueva si existen, si no, navega a detalles
      const routeMap = { Video: "Videos", Apunte: "Apuntes", Ejercicio: "Ejercicios" };
      if (s.archivo) window.open(s.archivo, "_blank");
      else navigate(`/Home/${routeMap[s.type]}/${s.id}`);
    }
  };

  // Marca una notificación como leída (DELETE) y ejecuta su enlace
  const handleNotificacionClick = async (noti) => {
    try {
      await fetch(`${API_URL}/notificaciones/${noti.id}`, { method: "DELETE" });
      setNotificaciones((prev) => prev.filter((n) => n.id !== noti.id));
      if (noti.enlace) {
        if (noti.enlace.startsWith("http")) window.open(noti.enlace, "_blank");
        else navigate(noti.enlace);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Elimina todas las notificaciones del usuario actual
  const handleLimpiarNotificaciones = async () => {
    try {
      await Promise.all(notificaciones.map((noti) => fetch(`${API_URL}/notificaciones/${noti.id}`, { method: "DELETE" })));
      setNotificaciones([]);
    } catch (e) {
      console.error(e);
    }
  };

  // Botonera principal dinámica basada en el rol (RBAC)
  const renderNavButtons = () => {
    if (tipo === "administrador") {
      return (
        <div className="nav-button-container">
          <button className="button-nav" onClick={() => window.open("https://asistencianebriacademy.atlassian.net/jira/software/projects/KAN/list?jql=project%20%3D%20KAN%20ORDER%20BY%20created%20DESC", "_blank")}>Incidencias</button>
          <button className={`button-nav ${location.pathname === "/Home/Accounts" ? "active" : ""}`} onClick={() => navigate("/Home/Accounts")}>Cuentas</button>
          <button className={`button-nav ${location.pathname === "/Home/Courses" ? "active" : ""}`} onClick={() => navigate("/Home/Courses")}>Cursos</button>
          <button className={`button-nav ${location.pathname === "/Home/Notes" ? "active" : ""}`} onClick={() => navigate("/Home/Notes")}>Apuntes</button>
        </div>
      );
    }
    if (tipo === "profesor") {
      return (
        <div className="container-nav-elements-teacher">
          <button className={`button-nav ${location.pathname === "/Home/Notes" ? "active" : ""}`} onClick={() => navigate("/Home/Notes")}>Apuntes</button>
          <button className={`add-course-button ${location.pathname === "/Home/AddCourse" ? "active" : ""}`} onClick={() => navigate("/Home/AddCourse")}>
            <img className="icon-button-plus" src={ButtonPlusIcon} alt="Añadir" />
            <h3>Añadir curso</h3>
          </button>
        </div>
      );
    }
    // Alumno por defecto
    return (
      <div className="nav-button-container">
        <button className={`button-nav ${location.pathname === "/Home/MySpace" ? "active" : ""}`} onClick={() => navigate("/Home/MySpace")}>Mi espacio</button>
        <button className={`button-nav ${location.pathname === "/Home/Courses" ? "active" : ""}`} onClick={() => navigate("/Home/Courses")}>Cursos</button>
        <button className={`button-nav ${location.pathname === "/Home/Professors" ? "active" : ""}`} onClick={() => navigate("/Home/Professors")}>Profesores</button>
        <button className={`button-nav ${location.pathname === "/Home/Notes" ? "active" : ""}`} onClick={() => navigate("/Home/Notes")}>Apuntes</button>
      </div>
    );
  };

  // Buscador oculto para profesores
  const renderSearch = () =>
    tipo === "alumno" || tipo === "administrador" ? (
      <div ref={searchRef} className="search-wrapper">
        <input
          type="search"
          className="nav-searchbar"
          placeholder="Buscar..."
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsSearchOpen(true);
            setIsNotificacionesOpen(false);
            setIsdesplegableOpen(false);
          }}
        />
        {/* Renderizado de lista de autocompletado */}
        {isSearchOpen && suggestions.length > 0 && (
          <ul className="search-suggestions-container">
            {suggestions.map((s) => (
              <li key={`${s.type}-${s.id}`} className="search-suggestions" onClick={() => handleSuggestionClick(s)}>
                <span className="suggested-name">{s.name}</span>
                <span className="suggested-type">{s.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : null;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="nav">
      {/* Logotipo y título con enrutamiento al Dashboard */}
      <div role="button" className="title-logo-container" onClick={() => navigate("/Home")}>
        <img className="logo-nav" src={Logo} alt="Logo" />
        <h2>NebriAcademy</h2>
      </div>

      {/* Campanita de Notificaciones para interfaz Móvil */}
      {usuario && (
        <div className="mobile-bell" ref={notificacionesRef}>
          <button
            className="bell-button"
            onClick={() => {
              setIsNotificacionesOpen(!isNotificacionesOpen);
              setIsMenuOpen(false);
              setIsdesplegableOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <img src={notificaciones.length > 0 ? BellPending : BellCheck} alt="Notificaciones" className="bell-img" />
          </button>

          {isNotificacionesOpen && (
            <div className="notif-dropdown-menu notif-mobile-menu">
              {notificaciones.length === 0 ? (
                <p className="no-notif">No hay notificaciones</p>
              ) : (
                <>
                  <div className="notif-cont">
                    {notificaciones.slice(0, 4).map((noti) => (
                      <button className="single-notif" key={noti.id} onClick={() => handleNotificacionClick(noti)}>
                        <div className="notif-msg">{noti.mensaje}</div>
                        <small className="msg-date">{new Date(noti.fecha).toLocaleDateString()}</small>
                      </button>
                    ))}
                  </div>
                  <button className="notif-clean-button" onClick={handleLimpiarNotificaciones}>Limpiar notificaciones</button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Menú hamburguesa Mobile */}
      <button
        className="hamburger-menu-button"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsNotificacionesOpen(false);
          setIsdesplegableOpen(false);
        }}
      >
        <img src={HamburgerMenuIcon} alt="Menu" className="hamburger-menu-icon" />
      </button>

      {/* Acciones principales, Buscador y Perfil (Versión Desktop) */}
      <div className="right-elements-container">
        {renderNavButtons()}
        {renderSearch()}

        {usuario && (
          <div className="notif-dropdown-container" ref={notificacionesRef}>
            <button
              className="bell-button"
              onClick={() => {
                setIsNotificacionesOpen(!isNotificacionesOpen);
                setIsdesplegableOpen(false);
                setIsSearchOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <img src={notificaciones.length > 0 ? BellPending : BellCheck} alt="Notificaciones" className="bell-img" />
            </button>

            {isNotificacionesOpen && (
              <div className="notif-dropdown-menu">
                {notificaciones.length === 0 ? (
                  <p className="no-notif">No hay notificaciones</p>
                ) : (
                  <>
                    <div className="notif-cont">
                      {notificaciones.slice(0, 4).map((noti) => (
                        <button className="single-notif" key={noti.id} onClick={() => handleNotificacionClick(noti)}>
                          <div className="notif-msg">{noti.mensaje}</div>
                          <small className="msg-date">{new Date(noti.fecha).toLocaleDateString()}</small>
                        </button>
                      ))}
                    </div>
                    <button className="notif-clean-button" onClick={handleLimpiarNotificaciones}>Limpiar notificaciones</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Componente Avatar y Dropdown de Opciones de Usuario */}
        <div className="dropdown-profile-container" ref={desplegableRef}>
          <button
            className="profile-button"
            onClick={() => {
              setIsdesplegableOpen(!isdesplegableOpen);
              setIsNotificacionesOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <Avatar name={`${usuario?.nombre} ${usuario?.apellidos}`} src={usuario?.imagenPerfil && PERFILES[usuario.imagenPerfil] ? PERFILES[usuario.imagenPerfil] : null} size="38px" />
          </button>

          {isdesplegableOpen && (
            <div className="dropdown-menu">
              <h3>{usuario?.nombre} {usuario?.apellidos}</h3>
              <p>{usuario?.email}</p>
              <button className="dropdown-item" onClick={() => { navigate("/Home/Profile"); setIsdesplegableOpen(false); }}>Mi Perfil</button>
              <button className="dropdown-item" onClick={() => { navigate("/Home/Help"); setIsdesplegableOpen(false); }}>Ayuda</button>
              <button className="dropdown-item" onClick={() => { navigate("/Home/MyTickets"); setIsdesplegableOpen(false); }}>Mis Tickets</button>
              {mostrarBotonCambio && <button className="dropdown-item" onClick={handleCambiarCuenta}>{textoBtnCambio}</button>}
              <button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido desplegado en el menú lateral Mobile */}
      {isMenuOpen && (
        <div className="hamburger-dropdown-menu" ref={menuRef}>
          <div className="container-right-elements-responsive">
            <div className="dropdown-profile-container" ref={desplegableRef}>
              <button className="profile-button" onClick={() => { setIsdesplegableOpen(!isdesplegableOpen); setIsNotificacionesOpen(false); }}>
                <img className="profile-nav" src={usuario?.imagenPerfil && PERFILES[usuario.imagenPerfil] ? PERFILES[usuario.imagenPerfil] : DefaultProfileImage} alt="Perfil" />
              </button>

              {isdesplegableOpen && (
                <div className="dropdown-menu">
                  <h3>{usuario?.nombre} {usuario?.apellidos}</h3>
                  <p>{usuario?.email}</p>
                  <button className="dropdown-item" onClick={() => { navigate("/Home/Profile"); setIsdesplegableOpen(false); }}>Mi Perfil</button>
                  <button className="dropdown-item" onClick={() => { navigate("/Home/Help"); setIsdesplegableOpen(false); }}>Ayuda</button>
                  <button className="dropdown-item" onClick={() => { navigate("/Home/MyTickets"); setIsdesplegableOpen(false); }}>Mis Tickets</button>
                  {mostrarBotonCambio && <button className="dropdown-item" onClick={handleCambiarCuenta}>{textoBtnCambio}</button>}
                  <button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
            {renderNavButtons()}
            {renderSearch()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
