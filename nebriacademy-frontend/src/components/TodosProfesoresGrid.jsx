import { useEffect, useState } from "react";
import TarjetaProfesores from "./TarjetaProfesores";

function TodosProfesoresGrid() {
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetch("http://localhost:3000/profesores")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Profesores)
          ? data.Profesores
          : data || [];
        setProfesores(list);
      })
      .catch((e) => {
        console.error("Error cargando profesores:", e);
        setError("No se pudieron cargar los profesores");
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="TodosProfesoresGrid">
      {profesores && profesores.length > 0 ? (
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
