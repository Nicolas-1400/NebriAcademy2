// ==========================================
// 1. IMPORTACIONES
// ==========================================
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// TarjetaVideoCurso: Componente atomizado que presenta el reproductor HTML5 de un video individual.
// Si expone propiedades de edición (para un profesor habilitado), inyecta controles modificadores.
function TarjetaVideoCurso({
  video,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  // ==========================================
  // 3. ESTADOS Y VARIABLES
  // ==========================================
  // Evalúa tempranamente si la tarjeta se pinta bajo modo edición y de parte de un docente
  const isProfesorEdit = tipo === "profesor" && editingMode;

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <div key={video.id} className="video-item">
      <div>
        <h5>{video.nombre}</h5>

        {/* Panel Administrativo (Visible solo para Docentes Autorizados) */}
        {isProfesorEdit && (
          <div className="edit-controls">
            <button
              onClick={() => handleEditNavigate("video", video)}
              title="Editar vídeo"
            >
              <img src={Editar} alt="Editar" />
            </button>
            <button
              onClick={() => handleDeleteContenido("video", video.id)}
              title="Borrar vídeo"
            >
              <img src={Eliminar} alt="Borrar vídeo" />
            </button>
          </div>
        )}
      </div>

      {/* Reproductor Nativo HTML5 para incrustar el streaming basándose en el archivo remoto */}
      <video controls>
        <source
          src={`http://localhost:3000/videos/files/${video.archivo}`}
          type="video/mp4"
        />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>
    </div>
  );
}

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default TarjetaVideoCurso;
