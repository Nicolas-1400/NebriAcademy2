import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mas from "../assets/mas.png";
import TarjetaApunte from "./TarjetaApunte";
import useAuthStore from "../store/useAuthStore";

function ApuntesGrid() {
  const [apuntes, setApuntes] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const { id } = useParams();

  const usuario = useAuthStore((s) => s.user);

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    // cargar apuntes, profesores y alumnos en paralelo
    Promise.all([
      fetch("http://localhost:3000/apuntes").then((r) => r.json()),
      fetch("http://localhost:3000/profesores").then((r) => r.json()),
      fetch("http://localhost:3000/alumnos").then((r) => r.json()),
    ])
      .then(([apRes, profRes, alumRes]) => {
        const listAp = Array.isArray(apRes.Apuntes)
          ? apRes.Apuntes
          : apRes || [];
        const listProf = Array.isArray(profRes.Profesores)
          ? profRes.Profesores
          : profRes || [];
        const listAlum = Array.isArray(alumRes.Alumnos)
          ? alumRes.Alumnos
          : alumRes || [];
        setApuntes(listAp);
        setProfesores(listProf);
        setAlumnos(listAlum);

        // cargar categorias desde endpoint sencillo
        fetch('http://localhost:3000/apuntes/categorias')
          .then((r) => r.json())
          .then((d) => setCategorias(Array.isArray(d.categorias) ? d.categorias : []))
          .catch(() => setCategorias([]));

        // si hay usuario, cargar sus likes desde /apuntesalumnos/likes
        if (usuario && usuario.id) {
          fetch(
            `http://localhost:3000/apuntesalumnos/likes?alumnoId=${usuario.id}`,
          )
            .then((r) => r.json())
            .then((d) => {
              setLikedIds(Array.isArray(d.apunteIds) ? d.apunteIds : []);
            })
            .catch(() => {});
        }
      })
      .catch((e) => {
        console.error("Error cargando apuntes/autores:", e);
        setError("No se pudieron cargar los apuntes");
      });
  }, [usuario]);

  const handleNavigateAddContenidoTipo = (tipoSeleccion) => {
    const targetId = id && Number(id) > 0 ? id : 0;
    navigate("/Home/Apuntes/AddApunte", {
      state: { tipo: tipoSeleccion, cursoId: id },
    });
  };

  if (error) return <p>{error}</p>;

  

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [editMode, setEditMode] = useState(false);

  const handleToggleLike = (apunte) => {
    if (!usuario || !usuario.id) return;
    fetch("http://localhost:3000/apuntesalumnos/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apunteId: apunte.id,
        alumnoId: usuario.id,
        vote: true,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const registro = data.registro || {};
        const apunteRes = data.apunte || {};
        setLikedIds((prev) => {
          const has = prev.includes(apunte.id);
          if (registro && registro.valoracion === true && !has)
            return [...prev, apunte.id];
          if (!registro || registro.valoracion !== true)
            return prev.filter((id) => id !== apunte.id);
          return prev;
        });
        setApuntes((prev) =>
          prev.map((a) =>
            a.id === apunte.id
              ? { ...a, valoracion: apunteRes.valoracion ?? a.valoracion }
              : a,
          ),
        );
      })
      .catch((err) => console.error("Error votando apunte:", err));
  };

  const resolveAutorNombre = (autorId) => {
    if (!autorId) return "";
    const aid = Number(autorId);
    const alumnoByUsuario = alumnos.find((al) => Number(al.usuarioId) === aid);
    if (alumnoByUsuario)
      return `${alumnoByUsuario.nombre} ${alumnoByUsuario.apellidos}`;
    const profByUsuario = profesores.find((p) => Number(p.usuarioId) === aid);
    if (profByUsuario)
      return `${profByUsuario.nombre} ${profByUsuario.apellidos}`;
    const alumnoById = alumnos.find((al) => Number(al.id) === aid);
    if (alumnoById) return `${alumnoById.nombre} ${alumnoById.apellidos}`;
    const profById = profesores.find((p) => Number(p.id) === aid);
    if (profById) return `${profById.nombre} ${profById.apellidos}`;
    return String(autorId);
  };

  const filteredApuntes = apuntes.filter((a) => {
    if (selectedCategory && a.categoria !== selectedCategory) return false;
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return true;
    const nombre = (a.nombre || a.archivo || "").toString().toLowerCase();
    const autorStr = resolveAutorNombre(a.autor).toString().toLowerCase();
    return nombre.includes(term) || autorStr.includes(term);
  });

  const processedApuntes = (() => {
    let list = [...filteredApuntes];
    if (viewMode === "misApuntes") {
      if (!usuario || !usuario.id) return [];
      list = list.filter((a) => Number(a.autor) === Number(usuario.id));
    }
    if (viewMode === "popular") {
      list.sort((x, y) => (Number(y.valoracion || 0) ?? 0) - (Number(x.valoracion || 0) ?? 0));
    }
    if (viewMode === "novedades") {
      list.sort((x, y) => (Number(y.id) || 0) - (Number(x.id) || 0));
    }
    return list;
  })();

  return (
    <div className="apuntes-grid">
      <aside className="buscador-sidebar-apuntes">
        <form
          role="search"
          className="formulario-busqueda"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar apuntes..."
            aria-label="Buscar apuntes"
          />
        </form>
        <div className="categorias-sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>
              <button
                onClick={() => setSelectedCategory("")}
                className={selectedCategory === "" ? "activo" : ""}
              >
                Todas
              </button>
            </li>
            {categorias.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "activo" : ""}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          {/* LÍNEA DE SEPARACIÓN */}
          <hr className="separador-sidebar" />
          <ul>
            <li>
              <button
                onClick={() => setViewMode("misApuntes")}
                className={viewMode === "misApuntes" ? "activo" : ""}
              >
                Mis apuntes
              </button>
            </li>
            <li>
              <button
                onClick={() => setViewMode("popular")}
                className={viewMode === "popular" ? "activo" : ""}
              >
                Populares
              </button>
            </li>
            <li>
              <button
                onClick={() => setViewMode("novedades")}
                className={viewMode === "novedades" ? "activo" : ""}
              >
                Novedades
              </button>
            </li>
          </ul>
          
          {/* LÍNEA DE SEPARACIÓN */}
          <hr className="separador-sidebar" />
          <div className="limpiar-filtros">
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchTerm("");
                setViewMode("all");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>
      
      <main className="apuntes-contenedor">
        <h2>Apuntes</h2>
        <div className="apuntes-list-container">
          {processedApuntes.length > 0 ? (
            <ul className="apuntes-list">
              {processedApuntes.map((ap) => (
                <li key={ap.id} className="apunte-item">
                  <TarjetaApunte
                    apunte={ap}
                    usuario={usuario}
                    likedIds={likedIds}
                    onToggleLike={handleToggleLike}
                    autorNombre={resolveAutorNombre(ap.autor)}
                    isEditMode={editMode}
                  />
                  {editMode && usuario && Number(usuario.id) === Number(ap.autor) && (
                    <div className="apunte-edit-controls">
                      <button
                        onClick={() =>
                          navigate("/Home/Apuntes/EditApunte", { state: { apunte: ap } })
                        }
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("¿Eliminar este apunte?")) return;
                          fetch(`http://localhost:3000/apuntes/${ap.id}`, {
                            method: "DELETE",
                          })
                            .then((r) => {
                              if (!r.ok) throw new Error("Error borrando");
                              setApuntes((prev) => prev.filter((x) => x.id !== ap.id));
                            })
                            .catch((err) => console.error("Error borrando apunte:", err));
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-apuntes">No hay apuntes que coincidan con los filtros.</p>
          )}
        </div>
      </main>
      <div className="fixed-action-group">
        <button
          className="editarApuntes"
          onClick={() => setEditMode((s) => !s)}
          title={editMode ? "Salir de edición" : "Editar"}
        >
          {editMode ? "Salir edición" : "Editar"}
        </button>
        <button
          className="subirContenidoCurso"
          onClick={() => handleNavigateAddContenidoTipo("apunte")}
          title="Subir apunte"
        >
          <img src={Mas} alt="Subir contenido" />
        </button>
      </div>
    </div>
  );
}

export default ApuntesGrid;
