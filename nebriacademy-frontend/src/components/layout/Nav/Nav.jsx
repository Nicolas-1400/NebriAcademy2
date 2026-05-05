// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "../../../assets/Iconos/nebriLogo.png";
import ImagenPerfilDefault from "../../../assets/Iconos/ImagenPerfilUsuario.png";
import { PERFILES } from "../../account/ProfileImageCard.jsx";
import ImagenBotonMas from "../../../assets/Iconos/botonMas.png";
import ImagenMenuHamburguesa from "../../../assets/Iconos/menuHamburguesa.png";
import useAuthStore from "../../../store/useAuthStore";
import CampanaPendiente from "../../../assets/Iconos/Campana-pendiente.png";
import CampanaCheck from "../../../assets/Iconos/Campana-check.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Barra de navegación principal: logo, buscador global, accesos rápidos, menú de perfil y menú hamburguesa
function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: usuario, tipo, logout: logoutStore, setUser } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado de apertura/cierre del menú desplegable de perfil, el menú hamburguesa y el buscador
  const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Referencias para detectar clics fuera de cada panel y cerrarlo
  const desplegableRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const notificacionesRef = useRef(null);

  // Estado del buscador: texto introducido, lista de sugerencias y caché de datos de la API
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [isNotificacionesOpen, setIsNotificacionesOpen] = useState(false);
  const [dataCache, setDataCache] = useState({
    cursos: [],
    apuntes: [],
    videos: [],
    ejercicios: [],
    profesores: [],
  });

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos todos los datos necesarios para el buscador en caché
  useEffect(() => {
    const endpoints = [
      { key: "cursos", url: `${API_URL}/cursos`, listKey: "Cursos" },
      {
        key: "apuntes",
        url: `${API_URL}/apuntes`,
        listKey: "Apuntes",
      },
      { key: "videos", url: `${API_URL}/videos`, listKey: "Videos" },
      {
        key: "ejercicios",
        url: `${API_URL}/ejercicios`,
        listKey: "Ejercicios",
      },
      {
        key: "profesores",
        url: `${API_URL}/profesores`,
        listKey: "Profesores",
      },
    ];

    // allSettled permite que aunque falle un endpoint, los demás sigan cargando
    Promise.allSettled(
      endpoints.map((ep) =>
        fetch(ep.url).then((respuesta) => respuesta.json()),
      ),
    ).then((resultados) => {
      const newData = {};
      resultados.forEach((resultado, index) => {
        const key = endpoints[index].key;
        const listKey = endpoints[index].listKey;
        newData[key] =
          resultado.status === "fulfilled"
            ? resultado.value[listKey] || []
            : [];
      });
      setDataCache(newData);
    });
  }, []);

  // Carga de notificaciones al montar y cuando cambie el usuario
  useEffect(() => {
    if (usuario && usuario.usuarioId) {
      fetch(`${API_URL}/notificaciones/${usuario.usuarioId}?tipo=${tipo}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setNotificaciones(data);
        })
        .catch((err) => console.error("Error fetching notificaciones", err));
    }
  }, [usuario, tipo]);

  // Cierra el desplegable de perfil, el buscador o el menú hamburguesa si se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desplegableRef.current &&
        !desplegableRef.current.contains(event.target)
      ) {
        setIsdesplegableOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".menu-hamburguesa-btn")
      ) {
        setIsMenuOpen(false);
      }
      if (
        notificacionesRef.current &&
        !notificacionesRef.current.contains(event.target) &&
        !event.target.closest(".campana-boton")
      ) {
        setIsNotificacionesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cierra el menú hamburguesa automáticamente si la ventana se hace suficientemente grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Limpia el store de autenticación y redirige al login al cerrar sesión
  const handleLogout = () => {
    logoutStore();
    navigate("/");
    setIsdesplegableOpen(false);
    setIsNotificacionesOpen(false);
  };

  // Alterna la sesión entre la cuenta de profesor y la de alumno vinculado
  const handleCambiarCuenta = async () => {
    try {
      const body =
        tipo === "profesor"
          ? { profesorId: usuario.id }
          : { alumnoId: usuario.id };

      const respuesta = await fetch(`${API_URL}/profesores/cambiar-cuenta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        setUser(datos.usuario, datos.tipo);
        setIsdesplegableOpen(false);
        setIsNotificacionesOpen(false);
        navigate("/Home");
      } else {
        console.error("Error al cambiar cuenta");
      }
    } catch (err) {
      console.error("Error de conexión al cambiar cuenta:", err);
    }
  };

  // Determina si el usuario actual tiene una cuenta vinculada y puede cambiar de modo
  const mostrarBotonCambio =
    tipo === "profesor"
      ? !!usuario?.alumnoVinculadoId
      : tipo === "alumno" && usuario?.esVinculado === 1;

  const textoBtnCambio =
    tipo === "profesor" ? "Cambiar a modo alumno" : "Cambiar a modo profesor";

  // Devuelve el nombre a mostrar en el buscador según el tipo de elemento
  const getDisplayName = (item, type) => {
    if (!item) return "";
    switch (type) {
      case "video":
        return item.nombre || item.titulo || "";
      case "curso":
        return item.nombreCurso || item.nombre || "";
      case "apunte":
      case "ejercicio":
        return item.nombre || "";
      case "profesor":
        return `${item.nombre || ""} ${item.apellidos || ""}`.trim();
      default:
        return "";
    }
  };

  // Filtra la caché de datos con el texto que el usuario va escribiendo y actualiza las sugerencias
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

    // Busca coincidencias por nombre en cada tipo de recurso
    const searchIn = (list, typeStr) => {
      list.forEach((item) => {
        const name = getDisplayName(item, typeStr.toLowerCase());
        if (name.toLowerCase().includes(qLower)) {
          results.push({
            id: item.id,
            name,
            type: typeStr,
            archivo: item.archivo,
          });
        }
      });
    };

    searchIn(dataCache.cursos, "Curso");
    searchIn(dataCache.apuntes, "Apunte");
    searchIn(dataCache.videos, "Video");
    searchIn(dataCache.ejercicios, "Ejercicio");
    searchIn(dataCache.profesores, "Profesor");

    // Eliminamos duplicados y limitamos a 8 resultados para no saturar el desplegable
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

  // Al hacer clic en una sugerencia, navega a la página correspondiente o abre el archivo directamente
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
      // Para vídeos, apuntes y ejercicios: s.archivo es la URL de Cloudinary
      const routeMap = {
        Video: "Videos",
        Apunte: "Apuntes",
        Ejercicio: "Ejercicios",
      };

      if (s.archivo) {
        // URL completa de Cloudinary → abrimos directamente en nueva pestaña
        window.open(s.archivo, "_blank");
      } else {
        navigate(`/Home/${routeMap[s.type]}/${s.id}`);
      }
    }
  };

  // Callback al clicar en una notificación
  const handleNotificacionClick = async (noti) => {
    try {
      await fetch(`${API_URL}/notificaciones/${noti.id}`, { method: "DELETE" });
      setNotificaciones((prev) => prev.filter((n) => n.id !== noti.id));
      if (noti.enlace) {
        if (noti.enlace.startsWith("http")) {
          window.open(noti.enlace, "_blank");
        } else {
          navigate(noti.enlace);
        }
      }
    } catch (e) {
      console.error("Error al marcar como vista la notificacion", e);
    }
  };

  // Función para limpiar todas las notificaciones
  const handleLimpiarNotificaciones = async () => {
    try {
      await Promise.all(
        notificaciones.map((noti) =>
          fetch(`${API_URL}/notificaciones/${noti.id}`, { method: "DELETE" }),
        ),
      );
      setNotificaciones([]);
    } catch (e) {
      console.error("Error al limpiar notificaciones", e);
    }
  };

  // Renderiza los botones de navegación según si el usuario es alumno, profesor o administrador
  const renderNavButtons = () => {
    if (tipo === "administrador") {
      return (
        <div className="contenedor-botones-nav">
          <button
            className="boton-nav"
            onClick={() =>
              window.open(
                "https://asistencianebriacademy.atlassian.net/jira/software/projects/KAN/list?jql=project%20%3D%20KAN%20ORDER%20BY%20created%20DESC",
                "_blank",
              )
            }
          >
            Incidencias
          </button>
          <button
            className={`boton-nav ${location.pathname === "/Home/Accounts" ? "activo" : ""}`}
            onClick={() => navigate("/Home/Accounts")}
          >
            Cuentas
          </button>
          <button
            className={`boton-nav ${location.pathname === "/Home/Courses" ? "activo" : ""}`}
            onClick={() => navigate("/Home/Courses")}
          >
            Cursos
          </button>
          <button
            className={`boton-nav ${location.pathname === "/Home/Notes" ? "activo" : ""}`}
            onClick={() => navigate("/Home/Notes")}
          >
            Apuntes
          </button>
        </div>
      );
    }
    if (tipo === "profesor") {
      return (
        <div className="contenedor-elementos-nav-profesor">
          <button
            className={`boton-nav ${location.pathname === "/Home/Notes" ? "activo" : ""}`}
            onClick={() => navigate("/Home/Notes")}
          >
            Apuntes
          </button>
          <button
            className={`boton-añadir-curso ${location.pathname === "/Home/AddCourse" ? "activo" : ""}`}
            onClick={() => navigate("/Home/AddCourse")}
          >
            <img
              className="icono-boton-mas"
              src={ImagenBotonMas}
              alt="Añadir"
            />
            <h3>Añadir curso</h3>
          </button>
        </div>
      );
    }
    return (
      <div className="contenedor-botones-nav">
        <button
          className={`boton-nav ${location.pathname === "/Home/MySpace" ? "activo" : ""}`}
          onClick={() => navigate("/Home/MySpace")}
        >
          Mi espacio
        </button>
        <button
          className={`boton-nav ${location.pathname === "/Home/Courses" ? "activo" : ""}`}
          onClick={() => navigate("/Home/Courses")}
        >
          Cursos
        </button>
        <button
          className={`boton-nav ${location.pathname === "/Home/Professors" ? "activo" : ""}`}
          onClick={() => navigate("/Home/Professors")}
        >
          Profesores
        </button>
        <button
          className={`boton-nav ${location.pathname === "/Home/Notes" ? "activo" : ""}`}
          onClick={() => navigate("/Home/Notes")}
        >
          Apuntes
        </button>
      </div>
    );
  };

  // El buscador solo se muestra si el usuario es administrador o alumno
  const renderSearch = () =>
    tipo === "alumno" || tipo === "administrador" ? (
      <div ref={searchRef} className="search-wrapper">
        <input
          type="search"
          className="barra-busqueda-nav"
          placeholder="Buscar..."
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsSearchOpen(true);
            setIsNotificacionesOpen(false);
            setIsdesplegableOpen(false);
          }}
        />
        {isSearchOpen && suggestions.length > 0 && (
          <ul className="sugerencias-busqueda-contenedor">
            {suggestions.map((s) => (
              <li
                key={`${s.type}-${s.id}`}
                className="sugerencias-busqueda"
                onClick={() => handleSuggestionClick(s)}
              >
                <span className="nombre-sugerencia">{s.name}</span>
                <span className="tipo-sugerencia">{s.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : null;

  return (
    <div className="nav">
      {/* Logo: al hacer clic navega al Home */}
      <div
        role="button"
        className="contenedor-logo-titulo"
        onClick={() => navigate("/Home")}
      >
        <img className="logo-nav" src={Logo} alt="Logo" />
        <h2>NebriAcademy</h2>
      </div>

      {/* Campanita de notificaciones (solo móvil): a la izquierda del botón hamburguesa */}
      {usuario && (
        <div className="campana-movil-btn" ref={notificacionesRef}>
          <button
            className="bell-btn"
            onClick={() => {
              setIsNotificacionesOpen(!isNotificacionesOpen);
              setIsMenuOpen(false);
              setIsdesplegableOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <img
              src={notificaciones.length > 0 ? CampanaPendiente : CampanaCheck}
              alt="Notificaciones"
              className="bell-img"
            />
          </button>

          {isNotificacionesOpen && (
            <div className="notif-desplegable-menu notif-movil-menu">
              {notificaciones.length === 0 ? (
                <p className="no-notif">No hay notificaciones</p>
              ) : (
                <>
                  {notificaciones.length > 4 && (
                    <div className="notif-cont">
                      {notificaciones.map((noti) => (
                        <button
                          className="single-notif"
                          key={noti.id}
                          onClick={() => handleNotificacionClick(noti)}
                        >
                          <div className="notif-msg">{noti.mensaje}</div>
                          <small className="msg-date">
                            {new Date(noti.fecha).toLocaleDateString()}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                  {notificaciones.length <= 4 &&
                    notificaciones.map((noti) => (
                      <button
                        className="single-notif"
                        key={noti.id}
                        onClick={() => handleNotificacionClick(noti)}
                      >
                        <div className="notif-msg">{noti.mensaje}</div>
                        <small className="msg-date">
                          {new Date(noti.fecha).toLocaleDateString()}
                        </small>
                      </button>
                    ))}
                  <button
                    className="notif-clean-btn"
                    onClick={handleLimpiarNotificaciones}
                  >
                    Limpiar notificaciones
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Botón hamburguesa: solo visible en pantallas pequeñas */}
      <button
        className="menu-hamburguesa-btn"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsNotificacionesOpen(false);
          setIsdesplegableOpen(false);
        }}
      >
        <img
          src={ImagenMenuHamburguesa}
          alt="Menu"
          className="menu-hamburguesa-icon"
        />
      </button>

      {/* Zona derecha de la nav: botones, buscador e imagen de perfil */}
      <div className="contenedor-elementos-derecha">
        {renderNavButtons()}
        {renderSearch()}

        {/* Campanita Notificaciones */}
        {usuario && (
          <div className="notif-desplegable-container" ref={notificacionesRef}>
            <button
              className="bell-btn" /* perfil-button" */
              onClick={() => {
                setIsNotificacionesOpen(!isNotificacionesOpen);
                setIsdesplegableOpen(false);
                setIsSearchOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <img
                src={
                  notificaciones.length > 0 ? CampanaPendiente : CampanaCheck
                }
                alt="Notificaciones"
                className="bell-img"
              />
            </button>

            {isNotificacionesOpen && (
              <div className="notif-desplegable-menu">
                {notificaciones.length === 0 ? (
                  <p className="no-notif">No hay notificaciones</p>
                ) : (
                  <>
                    {notificaciones.length > 4 && (
                      <div className="notif-cont">
                        {notificaciones.map((noti) => (
                          <button
                            className="single-notif"
                            key={noti.id}
                            onClick={() => handleNotificacionClick(noti)}
                          >
                            <div className="notif-msg">{noti.mensaje}</div>
                            <small className="msg-date">
                              {new Date(noti.fecha).toLocaleDateString()}
                            </small>
                          </button>
                        ))}
                      </div>
                    )}
                    {notificaciones.length <= 4 &&
                      notificaciones.map((noti) => (
                        <button
                          className="single-notif"
                          key={noti.id}
                          onClick={() => handleNotificacionClick(noti)}
                        >
                          <div className="notif-msg">{noti.mensaje}</div>
                          <small className="msg-date">
                            {new Date(noti.fecha).toLocaleDateString()}
                          </small>
                        </button>
                      ))}
                    <button
                      className="notif-clean-btn"
                      onClick={handleLimpiarNotificaciones}
                    >
                      Limpiar notificaciones
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botón de perfil con desplegable para ver datos, ir al perfil o cerrar sesión */}
        <div className="perfil-desplegable-container" ref={desplegableRef}>
          <button
            className="perfil-button"
            onClick={() => {
              setIsdesplegableOpen(!isdesplegableOpen);
              setIsNotificacionesOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <img
              className="perfil-nav"
              src={
                usuario?.imagenPerfil && PERFILES[usuario.imagenPerfil]
                  ? PERFILES[usuario.imagenPerfil]
                  : ImagenPerfilDefault
              }
              alt="Perfil"
            />
          </button>

          {isdesplegableOpen && (
            <div className="desplegable-menu">
              <h3>
                {usuario?.nombre} {usuario?.apellidos}
              </h3>
              <p>{usuario?.email}</p>
              <button
                className="desplegable-item"
                onClick={() => {
                  navigate("/Home/Profile");
                  setIsdesplegableOpen(false);
                }}
              >
                Mi Perfil
              </button>
              <button
                className="desplegable-item"
                onClick={() => {
                  navigate("/Home/Ayuda");
                  setIsdesplegableOpen(false);
                }}
              >
                Ayuda
              </button>
              <button
                className="desplegable-item"
                onClick={() => {
                  navigate("/Home/MisTickets");
                  setIsdesplegableOpen(false);
                }}
              >
                Mis Tickets
              </button>
              {mostrarBotonCambio && (
                <button
                  className="desplegable-item"
                  onClick={handleCambiarCuenta}
                >
                  {textoBtnCambio}
                </button>
              )}
              <button className="desplegable-item" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menú hamburguesa desplegable (versión responsive): contiene los mismos botones y el perfil */}
      {isMenuOpen && (
        <div className="menu-hamburguesa-desplegable" ref={menuRef}>
          <div className="contenedor-elementos-derecha-responsive">
            <div className="perfil-desplegable-container" ref={desplegableRef}>
              <button
                className="perfil-button"
                onClick={() => {
                  setIsdesplegableOpen(!isdesplegableOpen);
                  setIsNotificacionesOpen(false);
                }}
              >
                <img
                  className="perfil-nav"
                  src={
                    usuario?.imagenPerfil && PERFILES[usuario.imagenPerfil]
                      ? PERFILES[usuario.imagenPerfil]
                      : ImagenPerfilDefault
                  }
                  alt="Perfil"
                />
              </button>

              {isdesplegableOpen && (
                <div className="desplegable-menu">
                  <h3>
                    {usuario?.nombre} {usuario?.apellidos}
                  </h3>
                  <p>{usuario?.email}</p>
                  <button
                    className="desplegable-item"
                    onClick={() => {
                      navigate("/Home/Profile");
                      setIsdesplegableOpen(false);
                    }}
                  >
                    Mi Perfil
                  </button>
                  <button
                    className="desplegable-item"
                    onClick={() => {
                      navigate("/Home/Ayuda");
                      setIsdesplegableOpen(false);
                    }}
                  >
                    Ayuda
                  </button>
                  <button
                    className="desplegable-item"
                    onClick={() => {
                      navigate("/Home/MisTickets");
                      setIsdesplegableOpen(false);
                    }}
                  >
                    Mis Tickets
                  </button>
                  {mostrarBotonCambio && (
                    <button
                      className="desplegable-item"
                      onClick={handleCambiarCuenta}
                    >
                      {textoBtnCambio}
                    </button>
                  )}
                  <button className="desplegable-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
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


