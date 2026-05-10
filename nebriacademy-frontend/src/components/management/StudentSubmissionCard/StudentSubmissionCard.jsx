// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra la entrega de un alumno (su archivo subido) en la página de corrección de ejercicios
function StudentSubmissionCard({ registro }) {
  // Función para extraer solo el nombre real del archivo desde la URL de Cloudinary
  const obtenerNombreLimpio = (url) => {
    if (!url) return "Archivo sin nombre";
    if (!url.includes("/")) return url;
    
    let nombreArchivo = url.split('/').pop();
    try {
      nombreArchivo = decodeURIComponent(nombreArchivo);
    } catch (e) {}
    
    return nombreArchivo;
  };

  // Intentamos obtener el nombre del archivo de varios campos posibles para mayor robustez
  const archivo = registro.archivo || registro.file || registro.archivoNombre;
  const nombre = registro.nombre || registro.archivoNombre || obtenerNombreLimpio(archivo);
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
        <a href={archivo} target="_blank" rel="noreferrer">
          {nombre}
        </a>

        {alumnoNombre && (
          <div className="subtitulo-subido">Subido por: {alumnoNombre}</div>
        )}

        {descripcion && <p className="mt-2">{descripcion}</p>}
      </div>
    </li>
  );
}

export default StudentSubmissionCard;
