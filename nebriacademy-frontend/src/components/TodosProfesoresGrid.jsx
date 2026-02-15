import { useEffect, useState } from "react";
import TarjetaProfesores from "./TarjetaProfesores";

/**
 * Componente: TodosProfesoresGrid
 * Listado de todos los profesores registrados.
 */
function TodosProfesoresGrid() {
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {profesores.length > 0 ? (
        <div className="profesores-grid">
          <h2>Profesores</h2>
          <div className="profesores-contenedor">
            {profesores.map((p) => (
              <TarjetaProfesores
                key={p.id}
                nombre={p.nombre}
                apellidos={p.apellidos}
                especializacion={p.especializacion}
                profesorId={p.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No hay profesores disponibles.</p>
      )}
    </div>
  );
}

export default TodosProfesoresGrid;
