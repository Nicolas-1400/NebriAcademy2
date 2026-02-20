// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState } from "react";
import TarjetaProfesores from "./TarjetaProfesores";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// TodosProfesoresGrid: Componente de catálogo para visualizar a todos los docentes.
// Implementa un sistema de filtros combinados (texto y especialización) interpretado del lado del cliente.
function TodosProfesoresGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Repositorio global bajado del backend
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);

  // Estados reactivos que controlan los filtros de la barra lateral
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // ==========================================
  // 4. EFECTOS
  // ==========================================
  // Extracción del listado maestro de profesores al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/profesores")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProfesores(Array.isArray(datos.Profesores) ? datos.Profesores : []);
      })
      .catch((error) => {
        console.error("Error interconexión API:", error);
        setError("Error cargando profesores");
      });
  }, []);

  // ==========================================
  // 5. LÓGICA DE DERIVACIÓN Y FILTRADO
  // ==========================================
  // Extrae y deduce todas las "Especializaciones" disponibles creando un grupo Set() único
  const specializations = [
    ...new Set(profesores.map((p) => p.especializacion).filter((e) => e)),
  ];

  // Pipeline asíncrono que cruza los profesores de la base de datos con los dos filtros de usuario
  const filteredProfesores = profesores.filter((p) => {
    // 1. Filtro estricto: ¿El profesor pertenece a la Especialidad del botón activo?
    if (
      selectedSpecialization &&
      p.especializacion !== selectedSpecialization
    ) {
      return false;
    }

    // 2. Filtro abierto: ¿El nombre del profesor empata con la caja de búsqueda?
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Unifica nombre y apellido para facilitar la detección de texto
      const fullName = `${p.nombre} ${p.apellidos}`.toLowerCase();

      if (!fullName.includes(term)) return false;
    }

    return true;
  });

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {/* ===== BARRA LATERAL (FILTROS) ===== */}
      <aside className="buscador-sidebar-profesores">
        {/* Input Buscador Textual Libre */}
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

            {/* Inyecta de forma dinámica los botones de especialidades disponibles */}
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

          {/* Botón purificador de condiciones */}
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

      {/* ===== ÁREA DE RESULTADOS ===== */}
      <div className="profesores-grid">
        <h2>Profesores</h2>

        {/* Muestra el catálogo siempre que la matriz tras los filtros contenga elementos */}
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

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default TodosProfesoresGrid;
