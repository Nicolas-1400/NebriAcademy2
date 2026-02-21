// ==========================================
// 1. IMPORTACIONES
// ==========================================
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// TarjetaEjercicioCurso: Bloque visual para presentar una consigna o ejercicio.
// Soporta anidación condicional de botones CRUD según si el usuario es el Profesor dueño.
function TarjetaEjercicioCurso({
  ejercicio, // Objeto con metadata del ejercicio (identificador, texto, fichero adjunto)
  tipo, // Rol del usuario logueado en la sesión
  editingMode, // Flag booleano que determina si el profesor ha activado la edición
  handleEditNavigate, // Callback de redirección inyectado por el padre para modificar ejercicio
  handleDeleteContenido, // Callback de API injertado para destrucción de la consigna
}) {
  // ==========================================
  // 3. ESTADOS Y VARIABLES
  // ==========================================

  // Derivación de estado: Si es un profesor registrado en este curso Y está habilitado el click a edición
  const isProfesorEdit = tipo === "profesor" && editingMode;

  // ==========================================
  // 4. RENDERIZADO (JSX)
  // ==========================================
  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        {/* Enlace estático de descarga hacia el archivo PDF/Word provisto por el docente */}
        <a
          href={`http://localhost:3000/ejercicios/files/${ejercicio.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {ejercicio.nombre}
        </a>

        {/* Subtítulo o desglose del planteamiento */}
        {ejercicio.descripcion && <p>{ejercicio.descripcion}</p>}
      </div>

      {/* Condicional de privilegios de administrador del curso */}
      {isProfesorEdit && (
        <div className="edit-controls">
          <button
            onClick={() => handleEditNavigate("ejercicio", ejercicio)}
            title="Editar ejercicio"
          >
            <img src={Editar} alt="Editar" />
          </button>
          <button
            onClick={() => handleDeleteContenido("ejercicio", ejercicio.id)}
            title="Borrar ejercicio"
          >
            <img src={Eliminar} alt="Borrar ejercicio" />
          </button>
        </div>
      )}
    </li>
  );
}

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default TarjetaEjercicioCurso;
