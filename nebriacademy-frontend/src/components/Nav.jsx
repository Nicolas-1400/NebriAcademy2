// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "../assets/nebriLogo.png";
import ImagenPerfilDefault from "../assets/imagenPerfilUsuario.png";
import { PERFILES } from "./TarjetaImagenPerfil";
import ImagenBotonMas from "../assets/botonMas.png";
import ImagenMenuHamburguesa from "../assets/menuHamburguesa.png";
import useAuthStore from "../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Barra de navegación principal: logo, buscador global, accesos rápidos, menú de perfil y menú hamburguesa
function Nav() {
  const navigate = useNavigate();
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

  // Estado del buscador: texto introducido, lista de sugerencias y caché de datos de la API
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
      { key: "cursos", url: "http://localhost:3000/cursos", listKey: "Cursos" },
      {
        key: "apuntes",
        url: "http://localhost:3000/apuntes",
        listKey: "Apuntes",
      },
      { key: "videos", url: "http://localhost:3000/videos", listKey: "Videos" },
      {
        key: "ejercicios",
        url: "http://localhost:3000/ejercicios",
        listKey: "Ejercicios",
      },
      {
        key: "profesores",
        url: "http://localhost:3000/profesores",
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
  };

  // Alterna la sesión entre la cuenta de profesor y la de alumno vinculado
  const handleCambiarCuenta = async () => {
    try {
      const body =
        tipo === "profesor"
          ? { profesorId: usuario.id }
          : { alumnoId: usuario.id };

      const respuesta = await fetch(
        "http://localhost:3000/profesores/cambiar-cuenta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (respuesta.ok) {
        const datos = await respuesta.json();
        setUser(datos.usuario, datos.tipo);
        setIsdesplegableOpen(false);
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

    const baseUrl = "http://localhost:3000";
    if (s.type === "Curso") navigate(`/Home/Cursos/${s.id}`);
    else if (s.type === "Profesor") navigate(`/Home/Profesores/${s.id}`);
    else {
      // Para vídeos, apuntes y ejercicios: si tienen archivo lo abrimos en nueva pestaña; si no, navegamos
      const folderMap = {
        Video: "videos",
        Apunte: "apuntes",
        Ejercicio: "ejercicios",
      };
      const routeMap = {
        Video: "Videos",
        Apunte: "Apuntes",
        Ejercicio: "Ejercicios",
      };

      if (s.archivo) {
        window.open(
          `${baseUrl}/${folderMap[s.type]}/files/${s.archivo}`,
          "_blank",
        );
      } else {
        navigate(`/Home/${routeMap[s.type]}/${s.id}`);
      }
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
                "_blank"
              )
            }
          >
            Incidencias
          </button>
          <button
            className="boton-nav"
            onClick={() => navigate("/Home/Cuentas")}
          >
            Cuentas
          </button>
          <button
            className="boton-nav"
            onClick={() => navigate("/Home/Cursos")}
          >
            Cursos
          </button>
          <button
            className="boton-nav"
            onClick={() => navigate("/Home/Apuntes")}
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
            className="boton-nav"
            onClick={() => navigate("/Home/Apuntes")}
          >
            Apuntes
          </button>
          <button
            className="boton-añadir-curso"
            onClick={() => navigate("/Home/AddCurso")}
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
          className="boton-nav"
          onClick={() => navigate("/Home/MiEspacio")}
        >
          Mi espacio
        </button>
        <button className="boton-nav" onClick={() => navigate("/Home/Cursos")}>
          Cursos
        </button>
        <button
          className="boton-nav"
          onClick={() => navigate("/Home/Profesores")}
        >
          Profesores
        </button>
        <button className="boton-nav" onClick={() => navigate("/Home/Apuntes")}>
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
          onFocus={() => suggestions.length > 0 && setIsSearchOpen(true)}
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

      {/* Botón hamburguesa: solo visible en pantallas pequeñas */}
      <button
        className="menu-hamburguesa-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Botón de perfil con desplegable para ver datos, ir al perfil o cerrar sesión */}
        <div className="perfil-desplegable-container" ref={desplegableRef}>
          <button
            className="perfil-button"
            onClick={() => setIsdesplegableOpen(!isdesplegableOpen)}
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
                  navigate("/Home/Perfil");
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
                onClick={() => setIsdesplegableOpen(!isdesplegableOpen)}
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
                      navigate("/Home/Perfil");
                      setIsdesplegableOpen(false);
                    }}
                  >
                    Mi Perfil
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
