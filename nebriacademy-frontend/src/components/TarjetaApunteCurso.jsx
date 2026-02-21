// ==========================================
// 1. IMPORTACIONES
// ==========================================
import Editar from "../assets/Editar.png";
import Eliminar from "../assets/Eliminar.png";
import MeGusta from "../assets/MeGusta.png";
import MeGustaMarcado from "../assets/MeGustaMarcado.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// TarjetaApunteCurso: Visualiza un apunte (documento/link) dentro de un listado.
// Gestiona dinámicamente si el usuario puede interactuar (dar a like) o
// administrar el contenido (botones de edición/eliminación si es profesor en modo edición).
function TarjetaApunteCurso({
  apunte, // Objeto completo con metadata del archivo
  usuario, // Contexto de usuario local
  likedIds = [], // Array que trackea los likes de la sesión actual
  onToggleLike, // Callback desde componente padre para manejar likes
  tipo, // "profesor" | "alumno" -> rige el acceso a controles
  editingMode, // Boolean -> rige la visibilidad de panel admin
  handleEditNavigate, // Callback para navegar al formulario de update
  handleDeleteContenido, // Callback para confirmar destucción de recurso
}) {
  // ==========================================
  // 3. CÁLCULOS / LOGICA PREVIA AL RENDER
  // ==========================================

  // Verifica si el ID de este apunte está en la lista de likes proporcionada
  const isLiked = likedIds.includes(apunte.id);

  // Sólo un usuario de rol "profesor" que haya presionado "Editar Curso" (editingMode)
  // tendrá derecho a visualizar la botonera de administración
  const isProfesorEdit = tipo === "profesor" && editingMode;

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <div key={apunte.id} className="item-row">
      {/* 4.A. Información Central (Enlace y Descripción) */}
      <div className="item-main">
        <a
          // href directo apuntando a carpeta estática public/files/ del backend de NodeJS
          href={`http://localhost:3000/apuntes/files/${apunte.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {apunte.nombre || apunte.archivo}
        </a>

        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        {/* Fallback semántico: Autor o Nombre de autor según cómo llegue la relación del backend */}
        <p className="apunte-autor">{apunte.nombreAutor || apunte.autor}</p>
      </div>

      {/* 4.B. Controles de Administración (Condicionales para Profesor) */}
      {isProfesorEdit && (
        <div className="edit-controls">
          <button
            onClick={() => handleEditNavigate("apunte", apunte)}
            title="Editar apunte"
          >
            <img src={Editar} alt="Editar" />
          </button>

          <button
            onClick={() => handleDeleteContenido("apunte", apunte.id)}
            title="Borrar apunte"
          >
            <img src={Eliminar} alt="Borrar apunte" />
          </button>
        </div>
      )}

      {/* 4.C. Módulo Social (Likes) */}
      <div className="apunte-like">
        {/* El módulo like no se renderiza si el usuario global no inyectó el callback (visitante anónimo) */}
        {onToggleLike && usuario?.id && (
          <>
            <img
              src={isLiked ? MeGustaMarcado : MeGusta}
              alt="like"
              className={`like-icon ${isLiked ? "liked" : ""}`}
              onClick={() => onToggleLike(apunte)}
            />
            <span className="like-count">{apunte.valoracion || 0}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default TarjetaApunteCurso;
