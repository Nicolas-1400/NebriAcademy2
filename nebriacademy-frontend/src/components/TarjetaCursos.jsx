// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useNavigate } from "react-router-dom";
import Foto1 from "../assets/Cursos/Curso1.jpg";
import Foto2 from "../assets/Cursos/Curso2.jpg";
import Foto3 from "../assets/Cursos/Curso3.jpg";
import Foto4 from "../assets/Cursos/Curso4.jpg";
import Foto5 from "../assets/Cursos/Curso5.jpg";
import Foto6 from "../assets/Cursos/Curso6.jpg";
import Foto7 from "../assets/Cursos/Curso7.jpg";
import Foto8 from "../assets/Cursos/Curso8.jpg";
import Foto9 from "../assets/Cursos/Curso9.jpg";
import Foto10 from "../assets/Cursos/Curso10.jpg";
import Like from "../assets/MeGustaMarcado.png";
import Eliminar from "../assets/Eliminar.png";

// ==========================================
// 2. CONFIGURACIÓN DE RECURSOS ESTATICOS
// ==========================================

// Diccionario de fondos disponibles por defecto
const IMAGES_MAP = {
  Foto1,
  Foto2,
  Foto3,
  Foto4,
  Foto5,
  Foto6,
  Foto7,
  Foto8,
  Foto9,
  Foto10,
};

// Fallback secuencial
const IMAGES = [
  Foto1,
  Foto2,
  Foto3,
  Foto4,
  Foto5,
  Foto6,
  Foto7,
  Foto8,
  Foto9,
  Foto10,
];

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
// TarjetaCursos: Componente reutilizable para visualizar de manera resumida en cuadrícula
// la información principal de un curso, permitiendo la navegación hacia sus detalles o
// su eliminación si el modo edición de profesor está activo.
function TarjetaCursos({
  name, // Título
  cursoId, // Identificador único (también usado para fallback de imágenes)
  categoria, // Temática (ej. Programación)
  nivel, // Dificultad
  descripcion, // Preview textual
  profesor, // String ensamblado de Nombre + Apellidos
  valoracion, // Número de likes
  imagen, // Clave de la imagen en IMAGES_MAP
  isDeleting, // Boolean flag inyectado por el padre para renderizar botón [X]
  onDelete, // Delegate de función callback para efectuar el borrado
}) {
  // ==========================================
  // 4. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // 5. FUNCIONES AUXILIARES
  // ==========================================

  // Resuelve la URL o el Object local de la portada del curso.
  // Si el backend no envía 'imagen', asigna una cubierta genérica predecible basada en mod(id)
  const getCourseImage = () => {
    if (imagen && IMAGES_MAP[imagen]) return IMAGES_MAP[imagen];
    return IMAGES[cursoId % 10];
  };

  const imageSrc = getCourseImage();

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================
  return (
    <div
      className="tarjeta-curso"
      // Toda la tarjeta es clickeable. Navega a la vista detallada del catálogo
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
    >
      {/* Botón Flotante de Borrado: Solo visible si el grid padre activó modo borrado */}
      {isDeleting && (
        <button
          onClick={onDelete} // Dispara el trigger provisto vía props
          className="btn-delete-overlay"
          title="Eliminar curso"
        >
          <img src={Eliminar} alt="X" />
        </button>
      )}

      {/* Cubierta del curso */}
      <img src={imageSrc} alt="Imagen del curso" />

      {/* Metadatos */}
      <h3>{name}</h3>
      <p className="p-categoria">Categoría: {categoria}</p>
      <p className="p-nivel">Nivel: {nivel}</p>
      <p className="p-descripcion">{descripcion}</p>
      <p className="p-profesor">{profesor}</p>

      {/* Likes */}
      <p className="p-valoracion">
        <img src={Like} alt="Valoración" /> {valoracion}
      </p>
    </div>
  );
}

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default TarjetaCursos;
