// ==========================================
// 1. IMPORTACIONES
// ==========================================
// Integraciones de React y enrutador
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
// Recursos gráficos para elementos de la identidad visual de la app
import Logo from "../assets/nebriLogo.png";
import ImagenPerfilDefault from "../assets/imagenPerfilUsuario.png";
// Diccionario estático/mapping para el mapeo de nombres de imagenes de perfil a SVGs importados
import { PERFILES } from "./TarjetaImagenPerfil";
// Íconos visuales de control en la barra
import ImagenBotonMas from "../assets/botonMas.png";
import ImagenMenuHamburguesa from "../assets/menuHamburguesa.png";
// Contexto global que rige quién está usando la aplicación
import useAuthStore from "../store/useAuthStore";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Nav: Renderiza la barra de navegación superior principal de la plataforma.
// Responsable de proveer el menú contextual, botón de subida, barra de búsqueda en tiempo real,
// y gestionar las diferencias de UI detectando si es profesor o alumno.
function Nav() {
  const navigate = useNavigate();
  // Extracción exhaustiva de los métodos y roles disponibles en el local storage / contexto
  const { user: usuario, tipo, logout: logoutStore } = useAuthStore();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Controla el estado abierto/cerrado del menú que surge al hacer clic en el avatar
  const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
  // Controla la vista 'hamburguesa' para dispositivos pequeños/tablets
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Controla si se están mostrando o no las sugerencias originadas por el input de búsqueda
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Usadas fundamentalmente para detectar clicks 'Outside' de los elementos, logrando que se cierren nativamente
  const desplegableRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // "query" es la frase actual literal tecleada por el usuario
  const [query, setQuery] = useState("");
  // Elementos reducidos resultantes de la búsqueda
  const [suggestions, setSuggestions] = useState([]);

  // Caché temporal de metadatos obtenidas del backend.
  // Es costoso pedir datos a la API con cada letra tecleada, así que al cargar Navbar nos traemos
  // listados genéricos de todas las entidades una sola vez y filtramos esto del lado del cliente.
  const [dataCache, setDataCache] = useState({
    cursos: [],
    apuntes: [],
    videos: [],
    ejercicios: [],
    profesores: [],
  });

  // ==========================================
  // 4. EFECTOS DEL CLICLO DE VIDA
  // ==========================================

  // Al inicializar el Navbar (típicamente al cargar la app después del login), disparamos todas
  // las solicitudes hacia la base de datos de manera simultánea en una sola ráfaga usando Promise.allSettled.
  useEffect(() => {
    // Declaración de las rutas base y las tuplas descriptivas esperadas en las respuestas JSON
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
      // Prepara un objeto contenedor para inyectar sobre 'dataCache'
      const newData = {};

      resultados.forEach((resultado, index) => {
        const key = endpoints[index].key;
        const listKey = endpoints[index].listKey;
        // Solo almacenamos si la promesa particular se resolvió satisfactoriamente de la URL de destino
        newData[key] =
          resultado.status === "fulfilled"
            ? resultado.value[listKey] || []
            : [];
      });
      setDataCache(newData);
    });
  }, []); // Dependencia nula garantiza ejecución de 1 vez.

  // Escucha clics en cualquier parte de la ventana (document.addEventListener)
  // para colapsar los menús UI en caso de que el clic no haya caído dentro del bloque o reference ('ref').
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
        !event.target.closest(".menu-hamburguesa-btn") // Resguardo del botón inicial
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Acción de limpieza crucial para evitar Memory Leaks cuando Nav se desmonte.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Al pasar de estado responsivo (ancho angosto) a estado escritorio ancho,
  // aborta y cierra forzosamente el menú de hamburguesa. Garantiza estabilidad UI CSS.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // ==========================================
  // 5. VARIABLES DE LÓGICA Y HELPERS SECUNDARIOS
  // ==========================================

  // Normaliza el nombre de la variable asociada en memoria según la capa requerida a mostrar por la UI.
  // Ej: Un 'Curso' usa la propiedad `nombreCurso` pero un 'Profesor' requiere mezclar `nombre` y `apellidos`.
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

  // ==========================================
  // 6. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // Manejador del Log Out Total: Invoca la función destructora del Contexto y retorna a 'Guest'
  const handleLogout = () => {
    logoutStore();
    navigate("/");
    setIsdesplegableOpen(false);
  };

  // El motor de búsqueda local en tiempo real de la Navbar Global de NebriAcademy.
  const handleQueryChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    // Escape rápido: Si se está tipeando vacío abortamos
    if (!q.trim()) {
      setSuggestions([]);
      setIsSearchOpen(false);
      return;
    }

    // Estandarizamos para que la búsqueda sea "Case Insensitive" o minúsculas general.
    const qLower = q.toLowerCase();
    const results = [];

    // Closure auxiliar para penetrar en cada una de las listas dentro del Caché de datos
    const searchIn = (list, typeStr) => {
      list.forEach((item) => {
        const name = getDisplayName(item, typeStr.toLowerCase());

        // Si el término tipeado hace match literal por inclusión:
        if (name.toLowerCase().includes(qLower)) {
          results.push({
            id: item.id,
            name,
            type: typeStr,
            archivo: item.archivo, // Vital en el caso de los ficheros para la redirección.
          });
        }
      });
    };

    // Lanzamos el analizador sobre cada dominio cargado en RAM
    searchIn(dataCache.cursos, "Curso");
    searchIn(dataCache.apuntes, "Apunte");
    searchIn(dataCache.videos, "Video");
    searchIn(dataCache.ejercicios, "Ejercicio");
    searchIn(dataCache.profesores, "Profesor");

    // Recolector de Unicidad y Limitador
    const unique = [];
    const seen = new Set();

    // Devolvemos máximo de 8 resultados para no romper o hacer inmensa la interfaz visual superior.
    for (const r of results) {
      // Determinante compuesto de unicidad (no se repiten mismos entidades e IDS)
      const key = `${r.type}-${r.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
        if (unique.length >= 8) break;
      }
    }

    // Publicamos los resultados en la UI flotante.
    setSuggestions(unique);
    setIsSearchOpen(true);
  };

  // Acciones a ejecutar una vez que el usuario hace un Clic sobre un resultado exitoso de la búsqueda
  const handleSuggestionClick = (s) => {
    // 1. Limpieza total de parámetros del buscador
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    setIsMenuOpen(false);

    // 2. Comportamiento en base al tipo deducido del objeto seleccionado
    const baseUrl = "http://localhost:3000";

    if (s.type === "Curso") navigate(`/Home/Cursos/${s.id}`);
    else if (s.type === "Profesor") navigate(`/Home/Profesores/${s.id}`);
    else {
      // Casuística complejas donde se requiere acceder a ficheros en la URL del Backend
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

      // Si tiene archivo en servidor, lo abrimos de antemano.
      if (s.archivo) {
        window.open(
          `${baseUrl}/${folderMap[s.type]}/files/${s.archivo}`,
          "_blank",
        );
      } else {
        // Redirección si queremos verlo en grilla nativa de NebriAcademy
        navigate(`/Home/${routeMap[s.type]}/${s.id}`);
      }
    }
  };

  // ==========================================
  // 7. BLOQUES PARCIALES DE VISTAS (RENDER HELPERS)
  // ==========================================

  // Decide qué set de botones debe acompañar al rol particular autenticado (Sección Alumno Vs. Sección Profesor)
  const renderNavButtons = () => {
    // Vista de opciones del Profesor (Mínima y enfocada al añadido)
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

    // Vista de opciones del Alumno (Explorativa y global)
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

  // Se aísla el buscador porque lógicamente en este diseño los profesores NO ven la barra de búsquedas
  const renderSearch = () =>
    tipo === "alumno" ? (
      <div ref={searchRef} className="search-wrapper">
        <input
          type="search"
          className="barra-busqueda-nav"
          placeholder="Buscar cursos, apuntes, profesores..."
          value={query}
          onChange={handleQueryChange}
          onFocus={() => suggestions.length > 0 && setIsSearchOpen(true)}
        />

        {/* Renderiza el contenedor popup nativo asumiendo que el search esté activo  */}
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

  // ==========================================
  // 8. RENDERIZADO GLOBAL DEL COMPONENTE NAV
  // ==========================================
  return (
    <div className="nav">
      {/* 1. SECTOR LOGOTIPO Clickeable */}
      <div
        role="button"
        className="contenedor-logo-titulo"
        onClick={() => navigate("/Home")}
      >
        <img className="logo-nav" src={Logo} alt="Logo" />
        <h2>NebriAcademy</h2>
      </div>

      {/* 2. BOTÓN DE HAMBURGUESA / MODO MÓVIL ESTRECHO */}
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

      {/* 3. CONJUNTO SECUNDARIO: ACCESOS GLOBALES EN ESCRITORIO  */}
      <div className="contenedor-elementos-derecha">
        {/* Renderizamos dinámicamente según rol */}
        {renderNavButtons()}
        {renderSearch()}

        {/* --- Menú Desplegable Personal / Configuraciones de Desktop --- */}
        <div className="perfil-desplegable-container" ref={desplegableRef}>
          <button
            className="perfil-button"
            onClick={() => setIsdesplegableOpen(!isdesplegableOpen)}
          >
            {/* Foto de Perfil Dinámica (Soporta avatares o Imagen Default fallback) */}
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

          {/* Menus Ocultos */}
          {isdesplegableOpen && (
            <div className="desplegable-menu">
              <h3>
                {usuario?.nombre} {usuario?.apellidos}
              </h3>
              <p>{usuario?.email}</p>

              {/* Opciones directas. Se navega o desloguea, siempre cerrando posteriormente la pestaña UI */}
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

      {/* 4. CONJUNTO REDUCIDO (MÓVIL): MODO DESPLEGADO */}
      {/* Todo el contenido esencial viaja para adentro del desplegable negro lateral de celular */}
      {isMenuOpen && (
        <div className="menu-hamburguesa-desplegable" ref={menuRef}>
          <div className="contenedor-elementos-derecha-responsive">
            {/* --- Menú Desplegable Personal Inyectado en Móvil --- */}
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
                  <button className="desplegable-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Reciclamos la UI base de botones pero con CSS responsivo nativo */}
            {renderNavButtons()}
            {renderSearch()}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. EXPORTACIONES MÓDULO
// ==========================================
export default Nav;
