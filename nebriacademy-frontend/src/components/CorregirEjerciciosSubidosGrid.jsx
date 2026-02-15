import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import TarjetaEjercicioAlumno from "./TarjetaEjercicioAlumno";

/**
 * Componente: CorregirEjerciciosSubidosGrid
 * Permite al profesor ver ejercicios y asignar puntuaciones.
 */
function CorregirEjerciciosSubidosGrid() {
  const { id } = useParams();
  const [registros, setRegistros] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [inputScores, setInputScores] = useState({});

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/ejerciciosalumnos").then((respuesta) =>
        respuesta.json(),
      ),
      fetch("http://localhost:3000/alumnos").then((respuesta) =>
        respuesta.json(),
      ),
      fetch("http://localhost:3000/puntuacionesejercicios").then((respuesta) =>
        respuesta.json(),
      ),
    ])
      .then(([datosRegistros, datosAlumnos, datosPuntuaciones]) => {
        const allRegs = Array.isArray(datosRegistros.registros)
          ? datosRegistros.registros
          : datosRegistros || [];
        setRegistros(
          id
            ? allRegs.filter(
                (registro) => String(registro.ejercicioId) === String(id),
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
  }, [id]);

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

  const getExistingScore = (ejercicioId, alumnoId) => {
    return puntuaciones.find(
      (p) =>
        Number(p.ejercicioId) === Number(ejercicioId) &&
        Number(p.alumnoId) === Number(alumnoId),
    );
  };

  const handeScoreInput = (regId, val) => {
    setInputScores((prev) => ({ ...prev, [regId]: val }));
  };

  const handleSubmitScore = async (reg) => {
    const val = Number(inputScores[reg.id]);
    if (isNaN(val) || val < 0 || val > 10 || inputScores[reg.id] === "") {
      return alert("Introduce una nota válida (0-10)");
    }

    const existing = getExistingScore(reg.id, reg.alumnoId);
    const url = existing
      ? `http://localhost:3000/puntuacionesejercicios/${existing.id}`
      : "http://localhost:3000/puntuacionesejercicios";

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

      setPuntuaciones((prev) =>
        existing
          ? prev.map((p) => (p.id === datos.id ? datos : p))
          : [...prev, datos],
      );
      alert("Puntuación guardada");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la puntuación");
    }
  };

  return (
    <div>
      <h3>Ejercicios subidos</h3>
      {ejerciciosConNombre.length > 0 ? (
        <ul>
          {ejerciciosConNombre.map((reg) => {
            const existing = getExistingScore(reg.id, reg.alumnoId);
            const currentVal =
              inputScores[reg.id] !== undefined
                ? inputScores[reg.id]
                : (existing?.puntuacion ?? "");

            return (
              <li key={reg.id}>
                <TarjetaEjercicioAlumno registro={reg} />
                <div className="calificar-container">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="input-nota"
                    value={currentVal}
                    onChange={(e) => handeScoreInput(reg.id, e.target.value)}
                    placeholder="0-10"
                  />
                  <button onClick={() => handleSubmitScore(reg)}>
                    Guardar nota
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hay entregas para este ejercicio.</p>
      )}
    </div>
  );
}

export default CorregirEjerciciosSubidosGrid;
