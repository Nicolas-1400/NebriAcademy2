import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TarjetaEjercicioAlumno from "./TarjetaEjercicioAlumno";

function CorregirEjerciciosSubidosGrid() {
  const { id } = useParams(); // id del ejercicio (según la ruta usada)
  const [registros, setRegistros] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    // cargar registros de ejercicios subidos
    fetch("http://localhost:3000/ejerciciosalumnos")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.registros) ? data.registros : data || [];
        const filtered = id ? list.filter((r) => String(r.ejercicioId) === String(id)) : list;
        setRegistros(filtered);
      })
      .catch(() => setRegistros([]));

    // cargar lista de alumnos para mostrar nombres
    fetch("http://localhost:3000/alumnos")
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d.Alumnos) ? d.Alumnos : d || [];
        setAlumnos(arr);
      })
      .catch(() => setAlumnos([]));

    // cargar puntuaciones existentes
    fetch("http://localhost:3000/puntuacionesejercicios")
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d.PuntuacionesEjercicios) ? d.PuntuacionesEjercicios : d || [];
        setPuntuaciones(arr);
      })
      .catch(() => setPuntuaciones([]));
  }, [id]);

  const ejerciciosSubidos = registros.map((r) => {
    const al = alumnos.find((a) => Number(a.id) === Number(r.alumnoId));
    return { ...r, alumnoNombre: al ? `${al.nombre} ${al.apellidos}` : null };
  });

  const findExisting = (ejercicioId, alumnoId) => {
    return puntuaciones.find((p) => Number(p.ejercicioId) === Number(ejercicioId) && Number(p.alumnoId) === Number(alumnoId));
  };

  const handleScoreChange = (regId, value) => {
    setScores((s) => ({ ...s, [regId]: value }));
  };

  const handleSubmitScore = async (reg) => {
    const raw = scores[reg.id];
    const v = raw === undefined || raw === null || raw === '' ? '' : Number(raw);
    if (v === '' || Number.isNaN(v)) {
      alert('Introduce una nota válida (1-10)');
      return;
    }
    if (v < 1 || v > 10) {
      alert('La nota debe estar entre 1 y 10');
      return;
    }

    const existing = findExisting(reg.id, reg.alumnoId);
    try {
      if (existing) {
        const res = await fetch(`http://localhost:3000/puntuacionesejercicios/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ puntuacion: v }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Error actualizando');
        // actualizar en estado
        setPuntuaciones((prev) => prev.map((p) => (p.id === d.id ? d : p)));
        alert('Puntuación actualizada');
      } else {
        const res = await fetch('http://localhost:3000/puntuacionesejercicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ejercicioId: reg.id, alumnoId: reg.alumnoId, puntuacion: v }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Error creando');
        setPuntuaciones((prev) => [...prev, d]);
        alert('Puntuación guardada');
      }
    } catch (e) {
      console.error('Error guardando puntuación', e);
      alert('Error guardando puntuación');
    }
  };

  return (
    <div>
      <h3>Ejercicios subidos</h3>
      {ejerciciosSubidos && ejerciciosSubidos.length > 0 ? (
        <ul>
          {ejerciciosSubidos.map((reg) => {
            const existing = findExisting(reg.id, reg.alumnoId);
            const val = scores[reg.id] !== undefined ? scores[reg.id] : (existing ? existing.puntuacion : '');
            return (
              <li key={reg.id}>
                <TarjetaEjercicioAlumno registro={reg} />
                <div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="input-nota"
                    value={val}
                    onChange={(e) => handleScoreChange(reg.id, e.target.value)}
                    placeholder={existing ? String(existing.puntuacion) : '1-10'}
                  />
                  <button onClick={() => handleSubmitScore(reg)}>Guardar nota</button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hay ejercicios subidos para este ejercicio.</p>
      )}
    </div>
  );
}

export default CorregirEjerciciosSubidosGrid;