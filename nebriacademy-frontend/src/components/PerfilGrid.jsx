// ==========================================
// 1. IMPORTACIONES
// ==========================================
// Hooks de ciclo de vida y estado local
import { useEffect, useState } from "react";
// Acceso al estado global para manejar los datos de la sesión del usuario
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
// Imágenes y recursos visuales
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// PerfilGrid: Interfaz dedicada a alumnos para visualizar su información actual
// y proporcionar un formulario para actualizar sus datos personales en el servidor.
function PerfilGrid() {
  const navigate = useNavigate();
  // Se obtiene el usuario actual, la función para actualizarlo en el contexto global
  // y el tipo de usuario (que debiera ser 'alumno' en este contexto)
  const { user, setUser, tipo } = useAuthStore();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Almacena todos los campos editables del perfil del alumno.
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    contrasena: "", // Se mantiene vacío por seguridad; solo se envía si el usuario escribe una nueva
    numeroTarjeta: "",
    numTelefono: "",
    redes: "",
    pais: "",
    localidad: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false); // Previene envíos múltiples

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Efecto principal para inicializar y refrescar los datos del formulario:
  // Cuando se monta el componente o cambia el usuario activo, se consulta
  // la base de datos para asegurar de tener la información más reciente de ese alumno.
  useEffect(() => {
    // Protección: Si no está autenticado o no es alumno, no se efectúa la llamada.
    if (!user || tipo !== "alumno") return;

    fetch(`http://localhost:3000/usuarios/${user.id}?tipo=alumno`)
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        // En caso de fallo de red, utilizamos el contexto actual como respaldo
        const datosIniciales = datos || user;

        // Si llegaron datos frescos del servidor, se actualiza el estado global (Zustand)
        if (datos) setUser(datos, "alumno");

        // Se precargan los inputs del formulario con la información obtenida
        setFormData({
          nombre: datosIniciales.nombre || "",
          apellidos: datosIniciales.apellidos || "",
          contrasena: "", // Siempre limpio al cargar la vista
          numeroTarjeta: datosIniciales.numeroTarjeta || "",
          numTelefono: datosIniciales.numTelefono || "",
          redes: datosIniciales.redes || "",
          pais: datosIniciales.pais || "",
          localidad: datosIniciales.localidad || "",
        });
      })
      .catch((error) => console.error("Error cargando perfil:", error));
  }, [user?.id, tipo, setUser]); // Se ejecuta solo al variar el ID o el rol

  // ==========================================
  // 5. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // Manejador genérico para cualquier cambio en los campos de texto o selectores.
  // Permite tener una sola función para actualizar todo el objeto formData según el atributo 'name' del input.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lógica principal de envío para guardar los nuevos datos en el perfil del alumno.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al hacer submit

    // Resetea los estados de las notificaciones
    setMensajeError("");
    setMensajeExito("");

    // Bloquea el botón de envío
    setLoading(true);

    try {
      // Clona el estado del formulario e inserta explícitamente el tipo de usuario esperado por la API
      const payload = { ...formData, tipo: "alumno" };

      // Regla de Negocio: Si el usuario no escribió una nueva contraseña,
      // se elimina esa clave del payload para que el backend no la sobreescriba como un string vacío.
      if (!payload.contrasena) delete payload.contrasena;

      const respuesta = await fetch(
        `http://localhost:3000/usuarios/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (respuesta.ok) {
        // Si el backend procesó el PUT con éxito, responde con el nuevo usuario modificado
        const usuarioActualizado = await respuesta.json();

        // 1. Re-sincronizar el Frontend actualizando el estado de Zustand
        setUser(usuarioActualizado, "alumno");

        // 2. Limpiar el input de la contraseña
        setFormData((prev) => ({ ...prev, contrasena: "" }));

        // 3. Notificar al usuario exitosamente
        setMensajeExito("¡Perfil actualizado correctamente!");
        setTimeout(() => setMensajeExito(""), 3000); // Quitar mensaje luego de 3 segundos
      } else {
        const errorDatos = await respuesta.json();
        throw new Error(errorDatos.error || "Error al actualizar perfil");
      }
    } catch (error) {
      setMensajeError(error.message || "Error de conexión");
    } finally {
      // Siempre se debe desbloquear el botón de guardado, ocurran o no errores
      setLoading(false);
    }
  };

  // Render de seguridad: Mientras `user` no esté disponible desde Zustand,
  // se muestra un texto de carga, para evitar desbordes al pintar dependencias de `user`.
  if (!user) return <p>Cargando perfil...</p>;

  // ==========================================
  // 6. BLOQUE DE RENDERIZADO
  // ==========================================
  return (
    <div className="perfil">
      {/* SECCIÓN 1: Tarjeta de Presentación / Información del Usuario */}
      {/* Esta sección muestra los detalles actualmente validados por el sistema (es de solo lectura) */}
      <div className="datosPerfil">
        <h1>Mi Perfil</h1>
        <img className="imagenPerfil" src={ImagenPerfil} alt="Perfil Usuario" />
        <h2 className="nombrePerfil">{`${user.nombre} ${user.apellidos}`}</h2>
        <p className="correoPerfil">{user.email}</p>
        <p className="tipoPerfil">Alumno</p>

        {/* Muestra información adicional solo si existe en la base de datos */}
        {user.numTelefono && <p className="telPerfil">📱 {user.numTelefono}</p>}
        {user.pais && <p className="paisPerfil">🌍 {user.pais}</p>}
        {user.localidad && (
          <p className="localidadPerfil">🏙️ {user.localidad}</p>
        )}
      </div>

      {/* SECCIÓN 2: Formulario de Modificación de Datos */}
      <div className="formularioEditarPerfil">
        <h3>Editar Perfil</h3>

        {/* Renderizado condicional de mensajes informativos al usuario */}
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

        {/* Cada div agrupa el label y su respectivo input, vinculados al estado formData */}
        <form onSubmit={handleSubmit}>
          <div className="formulario-grupo">
            <label htmlFor="nombre">Nombre:</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
            />
          </div>

          {/* Campo Crítico: Contraseña. No se prellena nunca. */}
          <div className="formulario-grupo">
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
            <input
              name="numeroTarjeta"
              value={formData.numeroTarjeta}
              onChange={handleChange}
              placeholder="Tu número de tarjeta"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="numTelefono">Teléfono:</label>
            <input
              type="tel"
              name="numTelefono"
              value={formData.numTelefono}
              onChange={handleChange}
              placeholder="Tu teléfono"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="redes">Redes Sociales:</label>
            <input
              name="redes"
              value={formData.redes}
              onChange={handleChange}
              placeholder="@usuario"
            />
          </div>

          {/* Selector desplegable de Países predefinidos */}
          <div className="formulario-grupo">
            <label htmlFor="pais">País:</label>
            <select name="pais" value={formData.pais} onChange={handleChange}>
              <option value="" disabled>
                Seleccione un país
              </option>
              <option value="España">España</option>
              <option value="México">México</option>
              <option value="Colombia">Colombia</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Perú">Perú</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Reino Unido">Reino Unido</option>
              <option value="Alemania">Alemania</option>
              <option value="Francia">Francia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Selector desplegable de Localidades importantes asociadas a la plataforma */}
          <div className="formulario-grupo">
            <label htmlFor="localidad">Localidad:</label>
            <select
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
            >
              <option value="" disabled>
                Seleccione una localidad
              </option>
              <option value="Madrid">Madrid</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Valencia">Valencia</option>
              <option value="Sevilla">Sevilla</option>
              <option value="Bilbao">Bilbao</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Botón condicional que se deshabilita mientras `loading` sea verdadero para evitar spam en la red */}
          <button
            type="submit"
            className="boton-editar-perfil"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

          {/* Permite retornar de la edición del perfil a la página anterior en el historial del React Router */}
          <button
            type="button"
            className="boton-go-back"
            onClick={() => navigate(-1)}
          >
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 7. EXPORTACIONES MÓDULO
// ==========================================
export default PerfilGrid;
