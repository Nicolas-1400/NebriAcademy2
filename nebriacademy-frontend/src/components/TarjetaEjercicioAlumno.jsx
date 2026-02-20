// ==========================================
// 1. IMPORTACIONES
// ==========================================

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
function TarjetaEjercicioAlumno({ registro }) {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const archivo = registro.archivo || registro.file || registro.archivoNombre;
  const nombre = registro.nombre || registro.archivoNombre || archivo;
  const descripcion = registro.descripcion || registro.descripcionAlumno;

  // Resolución del nombre del alumno
  const alumnoNombre =
    registro.alumnoNombre ||
    registro.nombreAlumno ||
    (registro.alumno
      ? `${registro.alumno.nombre} ${registro.alumno.apellidos}`
      : null);

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <li key={registro.id} className="item-row">
      <div className="item-main">
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

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default TarjetaEjercicioAlumno;
