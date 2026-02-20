// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import TarjetaEjercicioAlumno from "./TarjetaEjercicioAlumno";
import "../styles/CorregirEjerciciosSubidosGrid.css";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// CorregirEjerciciosSubidosGrid: Panel de administración exclusivo para Profesores.
// Permite visualizar las entregas de los estudiantes vinculadas a una consigna específica
// y calificar de 0 a 10 cada submisión almacenando la nota en tiempo real.
function CorregirEjerciciosSubidosGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS GLOBALES
  // ==========================================

  // Extrae el ID del ejercicio originario desde la URL (ej: /Corregir/74)
  const { id } = useParams();

  // Registros en base de datos de los ficheros físicos entregados por los alumnos
  const [registros, setRegistros] = useState([]);
  // Diccionario cruzado de alumnos para resolver autoría
  const [alumnos, setAlumnos] = useState([]);
  // Matriz de calificaciones ya otorgadas (Histórico)
  const [puntuaciones, setPuntuaciones] = useState([]);

  // Borrador interactivo de UI: Alberga temporalmente las puntuaciones tecleadas antes del POST
  const [inputScores, setInputScores] = useState({});

  // ==========================================
  // 4. EFECTOS DEL CICLO DE VIDA
  // ==========================================

  // Descarga en paralelo (Promise.all) los ecosistemas implicados en la corrección
  // al montarse el componente. Resuelve Entregas, Alumnos y Notas Asignadas a la vez.
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
        // Fallbacks de seguridad por posibles variaciones en formato de respuesta API
        const allRegs = Array.isArray(datosRegistros.registros)
          ? datosRegistros.registros
          : datosRegistros || [];

        // Si hay ID de consigna definido en la URL, se purgan entregas de otros ejercicios
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

  // ==========================================
  // 5. VARIABLES DERIVADAS Y HELPERS
  // ==========================================

  // useMemo optimiza la mutación que interseca Entregas Anónimas con Datos del Alumno.
  // Solo se re-ejecuta si llegan entregas nuevas o cambia la lista de alumnos.
  const ejerciciosConNombre = useMemo(() => {
    return registros.map((r) => {
      const alumno = alumnos.find((a) => Number(a.id) === Number(r.alumnoId));
      return {
        ...r,
        // Agrega un alias pre-calculado para facilitar su renderizado en la tabla
        alumnoNombre: alumno
          ? `${alumno.nombre} ${alumno.apellidos}`
          : "Desconocido",
      };
    });
  }, [registros, alumnos]);

  // Helper local que sondea si ya existe una nota definitiva en el Histórico
  // para re-pintarla como "Placeholder" si el profe vuelve a entrar a editar.
  const getExistingScore = (ejercicioId, alumnoId) => {
    return puntuaciones.find(
      (p) =>
        Number(p.ejercicioId) === Number(ejercicioId) &&
        Number(p.alumnoId) === Number(alumnoId),
    );
  };

  // ==========================================
  // 6. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // ==========================================
  // 7. Actualización bidireccional reactiva del campo Input texto
  // ==========================================
  // Acumula la nota digitada en el diccionario de 'borrador' usando id de ejercicio como key
  const handeScoreInput = (regId, val) => {
    setInputScores((prev) => ({ ...prev, [regId]: val }));
  };

  // Transacción individual por entrega:
  // Analiza si ejecutar una Acción de Creación (POST) o Actualización (PUT)
  const handleSubmitScore = async (reg) => {
    const val = Number(inputScores[reg.id]);

    // Filtro de negocio: Las notas son estrictamente académicas [0, 10]
    if (isNaN(val) || val < 0 || val > 10 || inputScores[reg.id] === "") {
      return alert("Introduce una nota válida (0-10)");
    }

    const existing = getExistingScore(reg.id, reg.alumnoId);

    // ==========================================
    // 8. Rutas dinámicas e intercambio de verbos HTTP según condición de pre-existencia
    // ==========================================
    const url = existing
      ? `http://localhost:3000/puntuacionesejercicios/${existing.id}`
      : "http://localhost:3000/puntuacionesejercicios";

    const method = existing ? "PUT" : "POST";
    const body = existing
      ? { puntuacion: val } // Modificación parcial
      : { ejercicioId: reg.id, alumnoId: reg.alumnoId, puntuacion: val }; // Volcado completo

    try {
      const respuesta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "Error guardando nota");

      // ==========================================
      // 9. Actualización optimista de la memoria local para repintarlo "Calificado" sin requerir recargar la página
      // ==========================================
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

  // ==========================================
  // 10. BLOQUE DE RENDERIZADO (JSX)
  // ==========================================
  return (
    <div className="corregir-ejercicios-grid">
      <h3>Ejercicios subidos</h3>

      {ejerciciosConNombre.length > 0 ? (
        <ul className="ejercicios-lista">
          {/* Iteración masiva sobre cada ficha o entrega realizada por el alumnado */}
          {ejerciciosConNombre.map((reg) => {
            const existing = getExistingScore(reg.id, reg.alumnoId);

            // Priorización de despliegue: Mostrar lo que dicta el borrador por encima de la nota real (si el profe está editando on-the-fly)
            const currentVal =
              inputScores[reg.id] !== undefined
                ? inputScores[reg.id]
                : (existing?.puntuacion ?? "");

            return (
              <li className="ejercicio-contenedor" key={reg.id}>
                {/* Visualización inerte abstraída a una tarjeta de solo-lectura estiliada */}
                <TarjetaEjercicioAlumno registro={reg} />

                {/* Fila de controles administrativos / corrección numérica */}
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
                  <button
                    className="btn-guardar-nota"
                    onClick={() => handleSubmitScore(reg)}
                  >
                    Guardar nota
                  </button>
                  {/* Feature retenida para futuras implementaciones
                  <button className="btn-borrar-ejercicio" onClick={() => alert("Funcionalidad de borrado no implementada")}>
                    Borrar ejercicio
                  </button> */}
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

// ==========================================
// 11. EXPORTACIONES MÓDULO
// ==========================================
export default CorregirEjerciciosSubidosGrid;
