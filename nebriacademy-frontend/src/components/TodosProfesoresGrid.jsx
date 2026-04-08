// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import TarjetaProfesores from "./TarjetaProfesores";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Listado de todos los profesores con buscador por nombre y filtro por especialización
function TodosProfesoresGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);

  // Estado del buscador por nombre y del filtro por especialización
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos todos los profesores
  useEffect(() => {
    fetch(`${API_URL}/profesores`)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProfesores(Array.isArray(datos.Profesores) ? datos.Profesores : []);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error cargando profesores");
      });
  }, []);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Obtenemos las especializaciones únicas del listado para rellenar el filtro dinámicamente
  const specializations = [
    ...new Set(profesores.map((p) => p.especializacion).filter((e) => e)),
  ];

  // Filtramos la lista de profesores según los criterios activos (nombre y/o especialización)
  const filteredProfesores = profesores.filter((p) => {
    if (
      selectedSpecialization &&
      p.especializacion !== selectedSpecialization
    ) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const fullName = `${p.nombre} ${p.apellidos}`.toLowerCase();
      return fullName.includes(term);
    }
    return true;
  });

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {/* Sidebar lateral con buscador por nombre y filtro por especialización */}
      <aside className="buscador-sidebar-profesores">
        <div className="formulario-busqueda">
          <input
            type="search"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="categorias-sidebar">
          <h3>Especialización</h3>
          <ul>
            <li>
              <button
                onClick={() => setSelectedSpecialization("")}
                className={!selectedSpecialization ? "activo" : ""}
              >
                Todas
              </button>
            </li>
            {specializations.map((spec) => (
              <li key={spec}>
                <button
                  onClick={() => setSelectedSpecialization(spec)}
                  className={selectedSpecialization === spec ? "activo" : ""}
                >
                  {spec}
                </button>
              </li>
            ))}
          </ul>
          <hr className="separador-sidebar" />
          <div className="limpiar-filtros">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialization("");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>

      {/* Grid principal con las tarjetas de los profesores filtrados */}
      <div className="profesores-grid">
        <h2>Profesores</h2>
        {filteredProfesores.length > 0 ? (
          <div className="profesores-contenedor">
            {filteredProfesores.map((p) => (
              <TarjetaProfesores
                key={p.id}
                nombre={p.nombre}
                apellidos={p.apellidos}
                especializacion={p.especializacion}
                profesorId={p.id}
                imagenPerfil={p.imagenPerfil}
              />
            ))}
          </div>
        ) : (
          <p className="mensaje-vacio">No se encontraron profesores.</p>
        )}
      </div>
    </div>
  );
}

export default TodosProfesoresGrid;
