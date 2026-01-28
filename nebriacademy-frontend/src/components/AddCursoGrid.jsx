import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddCurso.css";
import flecha from "../assets/flecha-correcta.png";

function AddCursoGrid() {
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  

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


      const res = await fetch("http://localhost:3000/addCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso,
          categoria,
          descripcion,
          nivel,
          profesor: profesorId,
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
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
              <option value="" disabled>
                Selecciona categoría
              </option>
            <option value="Programacion">Programación</option>
            <option value="Diseno">Diseño</option>
            <option value="Ciberseguridad">Ciberseguridad</option>
            <option value="BDD">Base de datos</option>
            <option value="Marketing">Marketing</option>
            </select>
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

          

          {success ? (
            <p className="mensaje-exito">{success}</p>
          ) : (
            error && <p className="mensaje-error">{error}</p>
          )}
          <button type="submit" className="boton-editar-perfil">Crear curso</button>
          <button className="boton-go-back" onClick={() => navigate('/HomeProfesor')}>
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCursoGrid;