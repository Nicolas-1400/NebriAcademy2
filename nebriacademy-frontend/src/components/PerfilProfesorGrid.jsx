// ==========================================
// 1. IMPORTACIONES
// ==========================================
// Hooks base de ciclo de vida en React
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
// Herramientas de navegación programática
import { useNavigate } from "react-router-dom";
// Íconos y Assets Gráficos
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfilDefault from "../assets/imagenPerfilUsuario.png";
// Componente hermano/hijo destinado a la selección de avatares prestablecidos
import TarjetaImagenPerfil, { PERFILES } from "./TarjetaImagenPerfil";
// Hoja de estilos complementaria
import "../styles/TarjetaImagenPerfil.css";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// PerfilProfesorGrid: Panel de control exclusivo para los profesores registrados.
// Muestra su información pública y habilita un formulario reactivo para alterar su biografía o credenciales.
function PerfilProfesorGrid() {
  // Utilidad de enrutamiento histórico (sirve para el botón de ir atrás)
  const navigate = useNavigate();
  // Estado global de sesión: extrae al actor actual y el mutador (setUser) para sincronizar en tiempo real los cambios Guardados
  const { user, setUser, tipo } = useAuthStore();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Cachea temporalmente todos los campos que el profesor puede escribir antes de pulsar "Guardar"
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    contrasena: "", // Vacío por defecto: Si se envía vacío, el Backend sabrá NO alterar el Hash de seguridad
    numCuentaBancaria: "",
    numTelefono: "",
    redes: "",
    pais: "",
    localidad: "",
    especializacion: "",
    imagenPerfil: "",
  });

  const [mensajeExito, setMensajeExito] = useState(""); // Alerta verde de guardado
  const [mensajeError, setMensajeError] = useState(""); // Alerta roja de fallo
  const [loading, setLoading] = useState(false); // Bloqueo de múltiples submits simultáneos

  // ==========================================
  // 4. EFECTOS DEL CICLO DE VIDA
  // ==========================================

  // Descarga del estado actualizado del profesor directamente desde la Base de Datos al entrar a la página.
  // Previene que se editen datos desactualizados en caso de que hubiese mutado desde otra ventana/dispositivo.
  useEffect(() => {
    // Escudo de seguridad: Si no es profesor o no existe usuario activo, se aborta la carga
    if (!user || tipo !== "profesor") return;

    fetch(`http://localhost:3000/usuarios/${user.id}?tipo=profesor`)
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        // Fallback: Si la red falla a mitad del request, utilizamos la memoria de la cookie/Zustand
        const datosIniciales = datos || user;

        // Sincroniza el store general para que la cabecera (Header/Nav) refleje cambios recientes al instante
        if (datos) setUser(datos, "profesor");

        // Rellenado de campos temporales para el form (Controlled Inputs de React)
        setFormData({
          nombre: datosIniciales.nombre || "",
          apellidos: datosIniciales.apellidos || "",
          contrasena: "", // Jamás recibimos/popularizamos contraseñas por red HTTP
          numCuentaBancaria: datosIniciales.numCuentaBancaria || "",
          numTelefono: datosIniciales.numTelefono || "",
          redes: datosIniciales.redes || "",
          pais: datosIniciales.pais || "",
          localidad: datosIniciales.localidad || "",
          especializacion: datosIniciales.especializacion || "",
          imagenPerfil: datosIniciales.imagenPerfil || "",
        });
      })
      .catch((error) =>
        console.error("Error cargando perfil profesor:", error),
      );
  }, [user?.id, tipo, setUser]);

  // ==========================================
  // 5. FUNCIONES Y HANDLERS (EVENTOS)
  // ==========================================

  // Emisor de evento sintético: Inyecta el texto typeado en el Input respetivo según su atributo 'name'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Canal de Callback emitido desde el componente Hijo (TarjetaImagenPerfil)
  // Re-empaqueta la selección del avatar y muta el estado principal de este Padre
  const handleImageSelect = (nombreImagen) => {
    setFormData((prev) => ({ ...prev, imagenPerfil: nombreImagen }));
  };

  // Submit Maestro: Re-configuración de la entidad SQL del usuario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Detiene recarga brusca del navegador web
    setMensajeError("");
    setMensajeExito("");
    setLoading(true);

    try {
      // Clonado de los datos para su purificación antes del envío HTTP
      const payload = { ...formData, tipo: "profesor" };
      // Purga estricta: Garantiza que contraseñas vacías no viajen en el bus de datos
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
        // En base a la respuesta del servidor, re-seteamos todos los cachés
        const usuarioActualizado = await respuesta.json();
        setUser(usuarioActualizado, "profesor");
        setFormData((prev) => ({ ...prev, contrasena: "" }));

        // Destello afirmativo UI
        setMensajeExito("¡Perfil actualizado correctamente!");
        setTimeout(() => setMensajeExito(""), 3000); // Auto-borrado tras 3 segundos
      } else {
        const datosError = await respuesta.json();
        throw new Error(datosError.error || "Error al actualizar perfil");
      }
    } catch (error) {
      setMensajeError(error.message || "Error de conexión");
    } finally {
      setLoading(false); // Retira bloqueo de botones
    }
  };

  // ==========================================
  // 6. CÁLCULOS DEL RENDER
  // ==========================================

  // Salvaguarda: Retorno rápido en milisegundo anterior a la carga de Context
  if (!user) return <p>Cargando perfil...</p>;

  // Selección Matemática de la URL visual en crudo base 64 para la Imagen Actual mostrada.
  const imagenMostrar =
    formData.imagenPerfil && PERFILES[formData.imagenPerfil]
      ? PERFILES[formData.imagenPerfil]
      : ImagenPerfilDefault;

  // ==========================================
  // 7. BLOQUE DE RENDERIZADO (RETURN JSX)
  // ==========================================
  return (
    <div className="perfil">
      {/* Mitad Izquierda (O Arriba según Responsividad): Resumen Inamovible */}
      <div className="datosPerfil">
        <h1>Mi Perfil</h1>
        <img
          className="imagenPerfil"
          src={imagenMostrar}
          alt="Perfil Usuario"
        />
        <h2 className="nombrePerfil">{`${user.nombre} ${user.apellidos}`}</h2>
        <p className="correoPerfil">{user.email}</p>
        <p className="tipoPerfil">Profesor</p>

        {/* Desglose condicional de íconos públicos */}
        {user.especializacion && (
          <p className="especializacionPerfil">📚 {user.especializacion}</p>
        )}
        {user.numTelefono && <p className="telPerfil">📱 {user.numTelefono}</p>}
        {user.pais && <p className="paisPerfil">🌍 {user.pais}</p>}
        {user.localidad && (
          <p className="localidadPerfil">🏙️ {user.localidad}</p>
        )}
      </div>

      {/* Mitad Derecha (O Abajo según Responsividad): Formulario Estático de Alteración */}
      <div className="formularioEditarPerfil">
        <h3>Editar Perfil</h3>

        {/* Banners Superiores de Alerta (Toast en DOM) */}
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

        <form onSubmit={handleSubmit} className="formulario-profesor">
          {/* SECCIÓN SUPERIOR: Contenedora principal de los sub-campos y la cuadrícula de avatares */}
          <div className="seccion-superior-form">
            {/* Sector Seleccionador Multimedia */}
            <div className="columna-imagen">
              <label className="label-seccion">Imagen de Perfil:</label>
              <TarjetaImagenPerfil
                imagenSeleccionada={formData.imagenPerfil}
                onSelect={handleImageSelect}
              />
            </div>

            {/* Cuadrícula de Inputs de Metadatos Personales */}
            <div className="columna-datos">
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

              {/* El BackEnd asume que si esto llega en nulo, conservará la anterior. Esencial esta nota. */}
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
                <label htmlFor="numCuentaBancaria">Cuenta Bancaria:</label>
                <input
                  name="numCuentaBancaria"
                  value={formData.numCuentaBancaria}
                  onChange={handleChange}
                  placeholder="Tu cuenta bancaria"
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

              {/* Menú Categórico Controlado (Dropdown Especialización) */}
              <div className="formulario-grupo">
                <label htmlFor="especializacion">Especialización:</label>
                <select
                  name="especializacion"
                  value={formData.especializacion}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Seleccione una especialización
                  </option>
                  <option value="Programacion">Programación</option>
                  <option value="Diseño">Diseño</option>
                  <option value="Ciberseguridad">Ciberseguridad</option>
                  <option value="BDD">Base de datos</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Menú Categórico Controlado (Dropdown País) */}
              <div className="formulario-grupo">
                <label htmlFor="pais">País:</label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                >
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

              {/* Menú Categórico Temporal de Ciudades Target Españolas */}
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
            </div>
          </div>

          {/* Bloque Inferior Acciones Submit & Navigation */}
          <button
            type="submit"
            className="boton-editar-perfil"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

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
// 8. EXPORTACIONES MÓDULO
// ==========================================
export default PerfilProfesorGrid;
