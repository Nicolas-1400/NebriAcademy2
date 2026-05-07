// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../../config/api";
import { useEffect, useState } from "react";
import ProfessorCard from "../ProfessorCard/ProfessorCard";
import SearchSidebar from "../../../common/SearchSidebar/SearchSidebar";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Listado de todos los profesores con buscador por nombre y filtro por especialización
function AllProfessorsGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
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
      })
      .finally(() => setLoading(false));
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

  // ── Configuración del SearchSidebar ──────────────────────────────────────
  const filterGroups = [
    {
      label: "Especialización",
      key: "especializacion",
      options: [
        { label: "Todas", value: "" },
        ...specializations.map((spec) => ({ label: spec, value: spec })),
      ],
    },
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {/* Sidebar lateral con buscador por nombre y filtro por especialización */}
      <SearchSidebar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre..."
        filterGroups={filterGroups}
        activeFilters={{ especializacion: selectedSpecialization }}
        onFilterChange={(key, value) => setSelectedSpecialization(value)}
        onClearAll={() => {
          setSearchTerm("");
          setSelectedSpecialization("");
        }}
      />

      {/* Grid principal con las tarjetas de los profesores filtrados */}
      <div className="profesores-grid">
        <h2>Profesores</h2>
        {loading ? (
          <p className="mensaje-cargando">Cargando profesores...</p>
        ) : filteredProfesores.length > 0 ? (
          <div className="profesores-contenedor">
            {filteredProfesores.map((p) => (
              <ProfessorCard
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
          <p className="mensaje-vacio">No se han encontrado profesores.</p>
        )}
      </div>
    </div>
  );
}

export default AllProfessorsGrid;
