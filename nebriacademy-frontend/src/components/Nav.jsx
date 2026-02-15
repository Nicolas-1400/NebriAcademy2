import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "../assets/nebriLogo.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";
import ImagenBotonMas from "../assets/botonMas.png";
import ImagenMenuHamburguesa from "../assets/menuHamburguesa.png";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente: Nav
 * Barra de navegación principal responsive.
 * Maneja búsqueda global, perfil de usuario y menú móvil.
 */
function Nav() {
  const navigate = useNavigate();
  const { user: usuario, tipo, logout: logoutStore } = useAuthStore();

  // Estados de UI
  const [isdesplegableOpen, setIsdesplegableOpen] = useState(false); // Perfil
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburguesa (Móvil)
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Buscador

  // Referencias para click outside
  const desplegableRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Estados de Datos (Búsqueda)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dataCache, setDataCache] = useState({
    cursos: [],
    apuntes: [],
    videos: [],
    ejercicios: [],
    profesores: [],
  });

  // --- Efectos: Carga de Datos y Cierre de Menús ---

  // 1. Cargar datos para búsqueda global (una sola vez)
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

    Promise.allSettled(
      endpoints.map((ep) =>
        fetch(ep.url).then((respuesta) => respuesta.json()),
      ),
    ).then((resultados) => {
      // Organizamos los resultados. Si falló algo, simplemente dejamos esa lista vacía.
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

  // 2. Manejador global de clicks fuera de menús
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Perfil
      if (
        desplegableRef.current &&
        !desplegableRef.current.contains(event.target)
      ) {
        setIsdesplegableOpen(false);
      }
      // Buscador
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      // Hamburguesa (solo si click fuera del botón y del menú)
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".menu-hamburguesa-btn")
      ) {
        setIsMenuOpen(false);
      }
    };

    // Escuchamos cualquier clic en la página
    document.addEventListener("mousedown", handleClickOutside);

    // Al salir, limpiamos el evento
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---

  const handleLogout = () => {
    logoutStore();
    navigate("/");
    setIsdesplegableOpen(false);
  };

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

    // Helper para buscar y agregar
    const searchIn = (list, typeStr) => {
      list.forEach((item) => {
        const name = getDisplayName(item, typeStr.toLowerCase());
        if (name.toLowerCase().includes(qLower)) {
          results.push({
            id: item.id,
            name,
            type: typeStr,
            archivo: item.archivo, // Para videos/apuntes/ejercicios
          });
        }
      });
    };

    searchIn(dataCache.cursos, "Curso");
    searchIn(dataCache.apuntes, "Apunte");
    searchIn(dataCache.videos, "Video");
    searchIn(dataCache.ejercicios, "Ejercicio");
    searchIn(dataCache.profesores, "Profesor");

    // Deduplicar y limitar a 8
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

  const handleSuggestionClick = (s) => {
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    setIsMenuOpen(false); // Cerrar móvil si está abierto

    // Rutas
    const baseUrl = "http://localhost:3000";
    if (s.type === "Curso") navigate(`/Home/Cursos/${s.id}`);
    else if (s.type === "Profesor") navigate(`/Home/Profesores/${s.id}`);
    else {
      // Archivos estáticos (Video, Apunte, Ejercicio)
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

  // --- Render Helpers ---

  // Botones de Navegación (Reutilizables para desktop/mobile)
  const renderNavButtons = () => {
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

  // Buscador (Reutilizable)
  const renderSearch = () => (
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
  );

  return (
    <div className="nav">
      {/* 1. Logo */}
      <div
        role="button"
        className="contenedor-logo-titulo"
        onClick={() => navigate("/Home")}
      >
        <img className="logo-nav" src={Logo} alt="Logo" />
        <h2>NebriAcademy</h2>
      </div>

      {/* 2. Botón Hamburguesa (Mobile) */}
      <button
        className="menu-hamburguesa-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <img
          src={ImagenMenuHamburguesa}
          alt="Menu"
          style={{ width: 38, height: 38 }}
        />
      </button>

      {/* 3. Contenido Desktop */}
      <div className="contenedor-elementos-derecha">
        {renderNavButtons()}
        {renderSearch()}

        {/* Perfil Desktop */}
        <div className="perfil-desplegable-container" ref={desplegableRef}>
          <button
            className="perfil-button"
            onClick={() => setIsdesplegableOpen(!isdesplegableOpen)}
          >
            <img className="perfil-nav" src={ImagenPerfil} alt="Perfil" />
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
              <button className="desplegable-item" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="menu-hamburguesa-desplegable" ref={menuRef}>
          <div className="contenedor-elementos-derecha-responsive">
            {/* Perfil en Móvil */}
            <div className="perfil-mobile-section">
              <img className="perfil-nav" src={ImagenPerfil} alt="Perfil" />
              <div>
                <p>
                  <strong>{usuario?.nombre}</strong>
                </p>
                <button
                  onClick={() => {
                    navigate("/Home/Perfil");
                    setIsMenuOpen(false);
                  }}
                >
                  Mi Perfil
                </button>
                <button onClick={handleLogout}>Salir</button>
              </div>
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
