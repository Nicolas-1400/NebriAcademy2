// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../config/api";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentSubmissionCard from "./StudentSubmissionCard";
import flecha from "../../assets/Iconos/flecha-correcta.png";
import useAuthStore from "../../store/useAuthStore";
import useToastStore from "../../store/toastStore";
import useModalStore from "../../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página para que el profesor corrija las entregas de los alumnos a un ejercicio concreto
function GradeExercisesGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const { exerciseId } = useParams();
  const [registros, setRegistros] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  // Lista de puntuaciones ya guardadas para saber si hacer PUT o POST al guardar nota
  const [puntuaciones, setPuntuaciones] = useState([]);
  // Objeto para guardar el valor tecleado en el input de nota de cada entrega
  const [inputScores, setInputScores] = useState({});
  const { tipo } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();
  const navigate = useNavigate();

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar, cargamos en paralelo las entregas, los alumnos y las puntuaciones existentes
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ejerciciosalumnos`).then((respuesta) =>
        respuesta.json(),
      ),
      fetch(`${API_URL}/alumnos`).then((respuesta) => respuesta.json()),
      fetch(`${API_URL}/puntuacionesejercicios`).then((respuesta) =>
        respuesta.json(),
      ),
    ])
      .then(([datosRegistros, datosAlumnos, datosPuntuaciones]) => {
        const allRegs = Array.isArray(datosRegistros.registros)
          ? datosRegistros.registros
          : datosRegistros || [];
        // Si llega un ID en la URL, filtramos solo las entregas de ese ejercicio
        setRegistros(
          exerciseId
            ? allRegs.filter(
                (registro) =>
                  String(registro.ejercicioId) === String(exerciseId),
              )
            : allRegs,
        );

        setAlumnos(
          Array.isArray(datosAlumnos.Alumnos)
            ? datosAlumnos.Alumnos
            : datosAlumnos || [],
        );

        setPuntuaciones(
          Array.isArray(datosPuntuaciones.PuntuacionesEjercicios)
            ? datosPuntuaciones.PuntuacionesEjercicios
            : datosPuntuaciones || [],
        );
      })
      .catch((error) =>
        console.error("Error cargando datos corrección:", error),
      );
  }, [exerciseId]);

  // Añadimos a cada registro el nombre completo del alumno para mostrarlo en la tarjeta
  const ejerciciosConNombre = useMemo(() => {
    return registros.map((r) => {
      const alumno = alumnos.find((a) => Number(a.id) === Number(r.alumnoId));
      return {
        ...r,
        alumnoNombre: alumno
          ? `${alumno.nombre} ${alumno.apellidos}`
          : "Desconocido",
      };
    });
  }, [registros, alumnos]);

  // Busca si ya existe una puntuación guardada para un ejercicio-alumno concreto
  const getExistingScore = (ejercicioId, alumnoId) => {
    return puntuaciones.find(
      (p) =>
        Number(p.ejercicioId) === Number(ejercicioId) &&
        Number(p.alumnoId) === Number(alumnoId),
    );
  };

  // Actualiza el valor del input de nota para un registro concreto
  const handeScoreInput = (regId, val) => {
    setInputScores((prev) => ({ ...prev, [regId]: val }));
  };

  // Guarda o actualiza la puntuación de una entrega: usa PUT si ya existe, POST si no
  const handleSubmitScore = async (reg) => {
    const val = Number(inputScores[reg.id]);
    if (isNaN(val) || val < 0 || val > 10 || inputScores[reg.id] === "") {
      return addToast("Introduce una nota válida (0-10)", "error");
    }

    const existing = getExistingScore(reg.id, reg.alumnoId);
    const url = existing
      ? `${API_URL}/puntuacionesejercicios/${existing.id}`
      : `${API_URL}/puntuacionesejercicios`;

    const method = existing ? "PUT" : "POST";
    const body = existing
      ? { puntuacion: val }
      : { ejercicioId: reg.id, alumnoId: reg.alumnoId, puntuacion: val };

    try {
      const respuesta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "Error guardando nota");

      // Actualizamos la lista local de puntuaciones sin recargar la página
      setPuntuaciones((prev) =>
        existing
          ? prev.map((p) => (p.id === datos.id ? datos : p))
          : [...prev, datos],
      );
      addToast("Puntuación guardada", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al guardar la puntuación", "error");
    }
  };

  // Función exclusiva para administradores: borrar una entrega concreta
  const handleDeleteEntrega = async (entregaId) => {
    const reason = await showConfirm(
      "¿Seguro que deseas borrar esta entrega permanentemente?",
      "Borrar Entrega",
      { withInput: true },
    );
    if (reason === false) return;
    try {
      const url =
        typeof reason === "string" && reason.trim()
          ? `${API_URL}/ejerciciosalumnos/${entregaId}?reason=${encodeURIComponent(reason)}`
          : `${API_URL}/ejerciciosalumnos/${entregaId}`;

      const respuesta = await fetch(url, {
        method: "DELETE",
      });
      if (respuesta.ok) {
        setRegistros((prev) => prev.filter((r) => r.id !== entregaId));
        addToast("Entrega borrada", "success");
      } else {
        addToast("Error al borrar la entrega", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Error de red", "error");
    }
  };

  return (
    <div className="corregir-ejercicios-grid">
      <h3>Ejercicios subidos</h3>
      {ejerciciosConNombre.length > 0 ? (
        <ul className="ejercicios-lista">
          {ejerciciosConNombre.map((reg) => {
            const existing = getExistingScore(reg.id, reg.alumnoId);
            // Mostramos en el input el valor tecleado o, si no, la nota ya guardada
            const currentVal =
              inputScores[reg.id] !== undefined
                ? inputScores[reg.id]
                : (existing?.puntuacion ?? "");

            return (
              <li className="ejercicio-contenedor" key={reg.id}>
                <StudentSubmissionCard registro={reg} />
                {/* Input de nota y botón de guardar (profesores), y botón de borrar (profes/admins) */}
                <div className="calificar-container">
                  {tipo !== "administrador" && (
                    <>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        className="input-nota"
                        value={currentVal}
                        onChange={(e) =>
                          handeScoreInput(reg.id, e.target.value)
                        }
                        placeholder="0-10"
                      />
                      <button
                        className="btn-guardar-nota"
                        onClick={() => handleSubmitScore(reg)}
                      >
                        Guardar nota
                      </button>
                    </>
                  )}
                  {(tipo === "administrador" || tipo === "profesor") && (
                    <button
                      className="btn-borrar-ejercicio"
                      onClick={() => handleDeleteEntrega(reg.id)}
                    >
                      Borrar entrega
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hay entregas para este ejercicio.</p>
      )}
      <button className="boton-go-back" onClick={() => navigate(-1)}>
        <img src={flecha} alt="Volver" />
        <p>Volver</p>
      </button>
    </div>
  );
}

export default GradeExercisesGrid;
