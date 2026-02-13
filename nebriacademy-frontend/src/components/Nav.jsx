import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "../assets/nebriLogo.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";
import ImagenBotonMas from "../assets/botonMas.png";
import ImagenMenuHamburguesa from "../assets/menuHamburguesa.png";
import useAuthStore from "../store/useAuthStore";

function Nav() {
  const navigate = useNavigate();
  const [isdesplegableOpen, setIsdesplegableOpen] = useState(false);
  const desplegableRef = useRef(null);
  const usuario = useAuthStore((state) => state.user);
  const tipo = useAuthStore((state) => state.tipo);
  const logoutStore = useAuthStore((state) => state.logout);
  // Responsive menú hamburguesa
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // Cerrar menú hamburguesa al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el click es en el botón o su hijo, no cerrar
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-hamburguesa-btn')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Búsqueda
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [apuntes, setApuntes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const handleProfileClick = () => {
    setIsdesplegableOpen(!isdesplegableOpen);
  };

  const handleNavigateProfile = () => {
    navigate("/Home/Perfil");
    setIsdesplegableOpen(false);
  };

  const handleLogout = () => {
    logoutStore();
    navigate("/");
    setIsdesplegableOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desplegableRef.current &&
        !desplegableRef.current.contains(event.target)
      ) {
        setIsdesplegableOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar desplegable de búsqueda cuando se click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar datos para búsqueda (cliente filtra)
  useEffect(() => {
    fetch("http://localhost:3000/cursos")
      .then((r) => r.json())
      .then((d) => setCursos(d.Cursos || []))
      .catch(() => setCursos([]));
    fetch("http://localhost:3000/apuntes")
      .then((r) => r.json())
      .then((d) => setApuntes(d.Apuntes || []))
      .catch(() => setApuntes([]));
    fetch("http://localhost:3000/videos")
      .then((r) => r.json())
      .then((d) => setVideos(d.Videos || []))
      .catch(() => setVideos([]));
    fetch("http://localhost:3000/ejercicios")
      .then((r) => r.json())
      .then((d) => setEjercicios(d.Ejercicios || []))
      .catch(() => setEjercicios([]));
    fetch("http://localhost:3000/profesores")
      .then((r) => r.json())
      .then((d) => setProfesores(d.Profesores || []))
      .catch(() => setProfesores([]));
  }, []);

  const getDisplayName = (item, type) => {
    if (!item) return "";
    if (type === "video") return item.nombre || item.titulo || "";
    if (type === "curso") return item.nombreCurso || item.nombre || "";
    if (type === "apunte") return item.nombre || "";
    if (type === "ejercicio") return item.nombre || "";
    if (type === "profesor")
      return `${item.nombre || ""} ${item.apellidos || ""}`.trim();
    return "";
  };

  const handleQueryChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q || q.trim() === "") {
      setSuggestions([]);
      setIsSearchOpen(false);
      return;
    }
    const ql = q.toLowerCase();
    const results = [];

    cursos.forEach((c) => {
      const name = getDisplayName(c, "curso").toLowerCase();
      if (name.includes(ql))
        results.push({
          id: c.id,
          name: getDisplayName(c, "curso"),
          type: "Curso",
        });
    });
    apuntes.forEach((a) => {
      const name = getDisplayName(a, "apunte").toLowerCase();
      if (name.includes(ql))
        results.push({
          id: a.id,
          name: getDisplayName(a, "apunte"),
          archivo: a.archivo,
          type: "Apunte",
        });
    });
    videos.forEach((v) => {
      const name = getDisplayName(v, "video").toLowerCase();
      if (name.includes(ql))
        results.push({
          id: v.id,
          name: getDisplayName(v, "video"),
          archivo: v.archivo,
          type: "Video",
        });
    });
    ejercicios.forEach((eje) => {
      const name = getDisplayName(eje, "ejercicio").toLowerCase();
      if (name.includes(ql))
        results.push({
          id: eje.id,
          name: getDisplayName(eje, "ejercicio"),
          archivo: eje.archivo,
          type: "Ejercicio",
        });
    });
    profesores.forEach((p) => {
      const name = getDisplayName(p, "profesor").toLowerCase();
      if (name.includes(ql))
        results.push({
          id: p.id,
          name: getDisplayName(p, "profesor"),
          type: "Profesor",
        });
    });

    // eliminar duplicados por id+type y limitar
    const seen = new Set();
    const dedup = results
      .filter((r) => {
        const key = `${r.type}:${r.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);

    setSuggestions(dedup);
    setIsSearchOpen(true);
  };

  const handleSuggestionClick = (s) => {
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    // Navegar según tipo
    if (s.type === "Curso") navigate(`/Home/Cursos/${s.id}`);
    else if (s.type === "Video") {
      if (s.archivo)
        window.open(
          `http://localhost:3000/videos/files/${s.archivo}`,
          "_blank",
        );
      else navigate(`/Home/Videos/${s.id}`);
    } else if (s.type === "Apunte") {
      if (s.archivo)
        window.open(
          `http://localhost:3000/apuntes/files/${s.archivo}`,
          "_blank",
        );
      else navigate(`/Home/Apuntes/${s.id}`);
    } else if (s.type === "Ejercicio") {
      if (s.archivo)
        window.open(
          `http://localhost:3000/ejercicios/files/${s.archivo}`,
          "_blank",
        );
      else navigate(`/Home/Ejercicios/${s.id}`);
    } else if (s.type === "Profesor") navigate(`/Home/Profesores/${s.id}`);
  };

  return (
    <div className="nav">
      <div
        role="button"
        tabIndex={0}
        className="contenedor-logo-titulo"
        onClick={() => navigate("/Home")}
      >
        <img className="logo-nav" src={Logo} alt="Logo Nebriacademy" />
        <h2>NebriAcademy</h2>
      </div>
      {/* Botón menú hamburguesa solo visible en <1024px */}
      <button
        className="menu-hamburguesa-btn"
        onClick={() => setIsMenuOpen((v) => !v)}
        aria-label="Abrir menú"
      >
        <img src={ImagenMenuHamburguesa} alt="Abrir menú" style={{ width: 38, height: 38 }} />
      </button>
      {/* Contenedor elementos derecha normal (desktop) */}
      <div className="contenedor-elementos-derecha">
        {tipo === "profesor" ? (
          <div className="contenedor-elementos-nav-profesor">
            <button
              type="button"
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
                alt="Icono añadir curso"
              />
              <h3>Añadir curso</h3>
            </button>
          </div>
        ) : (
          <>
            <div className="contenedor-botones-nav">
              <button
                type="button"
                className="boton-nav"
                onClick={() => navigate("/Home/MiEspacio")}
              >
                Mi espacio
              </button>
              <button
                type="button"
                className="boton-nav"
                onClick={() => navigate("/Home/Cursos")}
              >
                Cursos
              </button>
              <button
                type="button"
                className="boton-nav"
                onClick={() => navigate("/Home/Profesores")}
              >
                Profesores
              </button>
              <button
                type="button"
                className="boton-nav"
                onClick={() => navigate("/Home/Apuntes")}
              >
                Apuntes
              </button>
            </div>
          </>
        )}
        <div ref={searchRef}>
          <input
            type="search"
            className="barra-busqueda-nav"
            placeholder="Buscar..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              if (suggestions.length) setIsSearchOpen(true);
            }}
            aria-label="Buscar"
          />
          {isSearchOpen && suggestions.length > 0 && (
            <ul className="sugerencias-busqueda-contenedor">
              {suggestions.map((s) => (
                <li
                  className="sugerencias-busqueda"
                  key={`${s.type}-${s.id}`}
                  onClick={() => handleSuggestionClick(s)}
                >
                  <span className="nombre-sugerencia">{s.name}</span>
                  <span className="tipo-sugerencia">{s.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="perfil-desplegable-container" ref={desplegableRef}>
          <button
            className="perfil-button"
            onClick={handleProfileClick}
            aria-label="Menú de perfil"
          >
            <img
              className="perfil-nav"
              src={ImagenPerfil}
              alt="Perfil Usuario"
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
                onClick={handleNavigateProfile}
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
      {/* Menú hamburguesa desplegable (responsive) */}
      {isMenuOpen && (
        <div className="menu-hamburguesa-desplegable" ref={menuRef}>
          <div className="contenedor-elementos-derecha-responsive">
            {/* 1. Perfil */}
            <div className="perfil-desplegable-container" ref={desplegableRef}>
              <button
                className="perfil-button"
                onClick={handleProfileClick}
                aria-label="Menú de perfil"
              >
                <img
                  className="perfil-nav"
                  src={ImagenPerfil}
                  alt="Perfil Usuario"
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
                    onClick={handleNavigateProfile}
                  >
                    Mi Perfil
                  </button>
                  <button className="desplegable-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
            {/* 2. Navegación */}
            {tipo === "profesor" ? (
              <div className="contenedor-elementos-nav-profesor">
                <button
                  type="button"
                  className="boton-nav"
                  onClick={() => { setIsMenuOpen(false); navigate("/Home/Apuntes"); }}
                >
                  Apuntes
                </button>
                <button
                  className="boton-añadir-curso"
                  onClick={() => { setIsMenuOpen(false); navigate("/Home/AddCurso"); }}
                >
                  <img
                    className="icono-boton-mas"
                    src={ImagenBotonMas}
                    alt="Icono añadir curso"
                  />
                  <h3>Añadir curso</h3>
                </button>
              </div>
            ) : (
              <>
                <div className="contenedor-botones-nav">
                  <button
                    type="button"
                    className="boton-nav"
                    onClick={() => { setIsMenuOpen(false); navigate("/Home/MiEspacio"); }}
                  >
                    Mi espacio
                  </button>
                  <button
                    type="button"
                    className="boton-nav"
                    onClick={() => { setIsMenuOpen(false); navigate("/Home/Cursos"); }}
                  >
                    Cursos
                  </button>
                  <button
                    type="button"
                    className="boton-nav"
                    onClick={() => { setIsMenuOpen(false); navigate("/Home/Profesores"); }}
                  >
                    Profesores
                  </button>
                  <button
                    type="button"
                    className="boton-nav"
                    onClick={() => { setIsMenuOpen(false); navigate("/Home/Apuntes"); }}
                  >
                    Apuntes
                  </button>
                </div>
              </>
            )}
            {/* 3. Buscador */}
            <div ref={searchRef}>
              <input
                type="search"
                className="barra-busqueda-nav"
                placeholder="Buscar..."
                value={query}
                onChange={handleQueryChange}
                onFocus={() => {
                  if (suggestions.length) setIsSearchOpen(true);
                }}
                aria-label="Buscar"
              />
              {isSearchOpen && suggestions.length > 0 && (
                <ul className="sugerencias-busqueda-contenedor">
                  {suggestions.map((s) => (
                    <li
                      className="sugerencias-busqueda"
                      key={`${s.type}-${s.id}`}
                      onClick={() => { setIsMenuOpen(false); handleSuggestionClick(s); }}
                    >
                      <span className="nombre-sugerencia">{s.name}</span>
                      <span className="tipo-sugerencia">{s.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
