import { useState } from "react";
import "../styles/AddCurso.css";

function AddCursoGrid() {
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [colaboradores, setColaboradores] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombreCurso || !categoria || !descripcion || !nivel) {
      setError("Rellena todos los campos");
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
      const profesorId = usuario.id || null;

      const collabArray = colaboradores
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);


      if (collabArray.length > 0) {
        const tieneApellidoFaltante = collabArray.some((c) => c.split(/\s+/).length < 3);
        if (tieneApellidoFaltante) {
          setError("Incluye nombre y DOS apellidos para cada colaborador (ej. Ana Pérez Gómez)");
          return;
        }
      }

      // Verificar que cada colaborador existe en la base de datos
      if (collabArray.length > 0) {
        try {
          const profResp = await fetch("http://localhost:3000/profesores");
          const profData = await profResp.json();
          const profesores = profData.Profesores || profData.profesores || [];

          const nombresEnBD = new Set(
            profesores.map((p) =>
              `${(p.nombre || "").trim()} ${(p.apellidos || "").trim()}`.toLowerCase()
            )
          );

          const missing = collabArray.filter((c) => {
            const normalized = c.replace(/\s+/g, " ").trim().toLowerCase();
            return !nombresEnBD.has(normalized);
          });

          if (missing.length > 0) {
            setError(
              "Los siguientes colaboradores no existen como profesores: " + missing.join(", ")
            );
            return;
          }
        } catch (err) {
          setError("No se pudo verificar colaboradores en la base de datos de profesores");
          console.error(err);
          return;
        }
      }

      const res = await fetch("http://localhost:3000/addCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso,
          categoria,
          descripcion,
          nivel,
          profesor: profesorId,
          colaboradores: collabArray,
        }),
      });

      const datos = await res.json();

      if (res.ok) {
        setSuccess("Curso creado correctamente");
        setError("");
        setNombreCurso("");
        setCategoria("");
        setDescripcion("");
        setNivel("");
        setColaboradores("");
        setTimeout(() => setSuccess(""), 6000);
      } else {
        setError(datos.error || "Error al crear curso");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="perfil-curso">
      <div className="formularioEditarPerfil">
        <h3>Crear Curso</h3>
        <form onSubmit={handleSubmit}>
          <div className="formulario-grupo">
            <label>Nombre del curso</label>
            <input
              type="text"
              placeholder="Nombre del curso"
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
              required
            />
          </div>

          <div className="formulario-grupo">
            <label>Categoría</label>
            <input
              type="text"
              placeholder="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>

          <div className="formulario-grupo">
            <label>Descripción</label>
            <textarea
              className="descripcion-textarea"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="formulario-grupo">
            <label>Nivel</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} required>
              <option value="" disabled>
                Selecciona nivel
              </option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="formulario-grupo">
            <label>Colaboradores (Formato: nombre y apellidos, nombre y apellidos, ...)</label>
            <input
              type="text"
              placeholder="Ana Pérez, Juan García"
              value={colaboradores}
              onChange={(e) => setColaboradores(e.target.value)}
            />
          </div>

          {success ? (
            <p className="mensaje-exito">{success}</p>
          ) : (
            error && <p className="mensaje-error">{error}</p>
          )}
          <button type="submit" className="boton-editar-perfil">Crear curso</button>
        </form>
      </div>
    </div>
  );
}

export default AddCursoGrid;