// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra la entrega de un alumno (su archivo subido) en la página de corrección de ejercicios
function TarjetaEjercicioAlumno({ registro }) {
  // Intentamos obtener el nombre del archivo de varios campos posibles para mayor robustez
  const archivo = registro.archivo || registro.file || registro.archivoNombre;
  const nombre = registro.nombre || registro.archivoNombre || archivo;
  const descripcion = registro.descripcion || registro.descripcionAlumno;

  // Intentamos obtener el nombre del alumno de varias formas posibles
  const alumnoNombre =
    registro.alumnoNombre ||
    registro.nombreAlumno ||
    (registro.alumno
      ? `${registro.alumno.nombre} ${registro.alumno.apellidos}`
      : null);

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <li key={registro.id} className="item-row">
      <div className="item-main">
        {/* El nombre del archivo enlaza directamente a la entrega del alumno */}
        <a
          href={`http://localhost:3000/ejerciciosalumnos/files/${archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {nombre}
        </a>

        {alumnoNombre && (
          <div className="subtitulo">Subido por: {alumnoNombre}</div>
        )}

        {descripcion && <p className="mt-2">{descripcion}</p>}
      </div>
    </li>
  );
}

export default TarjetaEjercicioAlumno;
