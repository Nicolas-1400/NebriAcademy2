import { useEffect, useState } from "react";
import TarjetaProfesores from "./TarjetaProfesores";

function TodosProfesoresGrid() {
  // Estados
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // Efectos
  useEffect(() => {
    fetch("http://localhost:3000/profesores")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProfesores(Array.isArray(datos.Profesores) ? datos.Profesores : []);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error cargando profesores");
      });
  }, []);

  // Helpers
  const specializations = [
    ...new Set(
      profesores.map((p) => p.especializacion).filter((e) => e), // Filtrar nulos/vacíos
    ),
  ];

  // Filtros
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

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {/* SIDEBAR */}
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

      {/* GRID */}
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
