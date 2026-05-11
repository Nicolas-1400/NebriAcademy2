// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import ArrowCorrect from "../../../assets/Icons/arrow-correct.png";
import DefaultProfileImage from "../../../assets/Icons/DefaultProfileImage.png";
import ProfileImageCard, {
  PERFILES,
} from "../ProfileImageCard/ProfileImageCard";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Perfil del usuario (alumno/administrador/profesor): muestra sus datos y permite editarlos
function ProfileGrid() {
  const navigate = useNavigate();
  const { user, setUser, tipo } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado del formulario de edición (contiene campos de todos los tipos de usuario)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    contrasena: "",
    numeroTarjeta: "", // Solo Alumno
    numCuentaBancaria: "", // Solo Profesor
    numTelefono: "",
    redes: "",
    pais: "",
    localidad: "",
    especializacion: "", // Solo Profesor
    imagenPerfil: "", // Solo Profesor
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos los datos más recientes del usuario desde la API y los precargamos en el formulario
  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/usuarios/${user.id}?tipo=${tipo}`)
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        const datosIniciales = datos || user;
        // Actualizamos también el store global para que el Nav muestre datos frescos
        if (datos) setUser(datos, tipo);

        setFormData({
          nombre: datosIniciales.nombre || "",
          apellidos: datosIniciales.apellidos || "",
          contrasena: "",
          numeroTarjeta: datosIniciales.numeroTarjeta || "",
          numCuentaBancaria: datosIniciales.numCuentaBancaria || "",
          numTelefono: datosIniciales.numTelefono || "",
          redes: datosIniciales.redes || "",
          pais: datosIniciales.pais || "",
          localidad: datosIniciales.localidad || "",
          especializacion: datosIniciales.especializacion || "",
          imagenPerfil: datosIniciales.imagenPerfil || "",
        });
      })
      .catch((error) => console.error("Error cargando perfil:", error));
  }, [user?.id, tipo, setUser]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Actualiza el campo correspondiente del formulario cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Actualiza la imagen de perfil seleccionada (solo para profesores)
  const handleImageSelect = (nombreImagen) => {
    setFormData((prev) => ({ ...prev, imagenPerfil: nombreImagen }));
  };

  // Envía los cambios al backend. Si la contraseña está vacía, no se incluye en el payload(subida).
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");
    setLoading(true);

    try {
      const payload = { ...formData, tipo };
      if (!payload.contrasena) delete payload.contrasena;

      // Limpiamos campos que no corresponden al tipo para evitar ruidos en BD (opcional)
      if (tipo !== "alumno") delete payload.numeroTarjeta;
      if (tipo !== "profesor") {
        delete payload.numCuentaBancaria;
        delete payload.especializacion;
        delete payload.imagenPerfil;
      }

      const respuesta = await fetch(`${API_URL}/usuarios/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        const usuarioActualizado = await respuesta.json();
        setUser(usuarioActualizado, tipo);
        setFormData((prev) => ({ ...prev, contrasena: "" }));
        setMensajeExito("¡Perfil actualizado correctamente!");
        // El mensaje de éxito desaparece solo tras 3 segundos
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        const errorDatos = await respuesta.json();
        throw new Error(errorDatos.error || "Error al actualizar perfil");
      }
    } catch (error) {
      setMensajeError(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  // Determinamos qué imagen mostrar en el panel izquierdo
  const imagenMostrar =
    tipo === "profesor" &&
    formData.imagenPerfil &&
    PERFILES[formData.imagenPerfil]
      ? PERFILES[formData.imagenPerfil]
      : DefaultProfileImage;

  return (
    <div className="profile-container">
      {/* Panel izquierdo: datos de solo lectura */}
      <div className="profile-details-card">
        <h1>Mi Perfil</h1>
        <img
          className="profile-avatar"
          src={imagenMostrar}
          alt="Perfil Usuario"
        />
        <h2 className="profile-name">{`${user.nombre || ""} ${user.apellidos || ""}`}</h2>
        {!user.esVinculado && <p className="profile-email">{user.email}</p>}
        <p className="profile-role">
          {tipo === "administrador"
            ? "Administrador"
            : tipo === "profesor"
              ? "Profesor"
              : user.esVinculado
                ? "Alumno (cuenta vinculada)"
                : "Alumno"}
        </p>

        {tipo === "profesor" && user.especializacion && (
          <p className="profile-specialization">📚 {user.especializacion}</p>
        )}
        {user.numTelefono && (
          <p className="profile-phone">📱 {user.numTelefono}</p>
        )}
        {user.pais && <p className="profile-country">🌍 {user.pais}</p>}
        {user.localidad && <p className="profile-city">🏙️ {user.localidad}</p>}
      </div>

      {/* Panel derecho: formulario para editar los datos del perfil */}
      <div className="edit-profile-form">
        <h3>Editar Perfil</h3>
        {mensajeExito && <p className="message-success">{mensajeExito}</p>}
        {mensajeError && <p className="message-error">{mensajeError}</p>}

        <form
          onSubmit={handleSubmit}
          className={tipo === "profesor" ? "teacher-form-layout" : ""}
        >
          {/* Si es profesor, usamos el layout de dos columnas para el avatar */}
          {tipo === "profesor" ? (
            <div className="form-top-section">
              <div className="form-image-column">
                <label className="form-section-label">Imagen de Perfil:</label>
                <ProfileImageCard
                  imagenSeleccionada={formData.imagenPerfil}
                  onSelect={handleImageSelect}
                />
              </div>

              <div className="form-data-column">
                <FormularioCampos
                  formData={formData}
                  handleChange={handleChange}
                  tipo={tipo}
                  user={user}
                />
              </div>
            </div>
          ) : (
            <FormularioCampos
              formData={formData}
              handleChange={handleChange}
              tipo={tipo}
              user={user}
            />
          )}

          <button type="submit" className="btn-edit-profile" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

          <button
            type="button"
            className="button-go-back"
            onClick={() => navigate(-1)}
          >
            <img src={ArrowCorrect} alt="Volver" />
            <p>Volver</p>
          </button>
        </form>
      </div>
    </div>
  );
}

// Subcomponente para renderizar los campos del formulario de forma limpia
function FormularioCampos({ formData, handleChange, tipo, user }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
      </div>

      <div className="form-group">
        <label htmlFor="apellidos">Apellidos:</label>
        <input
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          placeholder="Tus apellidos"
        />
      </div>

      {/* Contraseña: solo para alumnos no vinculados, profesores o administradores */}
      {(!user.esVinculado || tipo !== "alumno") && (
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Dejar en blanco para no cambiar"
          />
        </div>
      )}

      {/* Campos específicos según el tipo */}
      {tipo === "alumno" && !user.esVinculado && (
        <div className="form-group">
          <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
          <input
            name="numeroTarjeta"
            value={formData.numeroTarjeta}
            onChange={handleChange}
            placeholder="Tu número de tarjeta"
          />
        </div>
      )}

      {tipo === "profesor" && (
        <>
          <div className="form-group">
            <label htmlFor="numCuentaBancaria">Cuenta Bancaria:</label>
            <input
              name="numCuentaBancaria"
              value={formData.numCuentaBancaria}
              onChange={handleChange}
              placeholder="Tu cuenta bancaria"
            />
          </div>

          <div className="form-group">
            <label htmlFor="especializacion">Especialización:</label>
            <select
              name="especializacion"
              value={formData.especializacion}
              onChange={handleChange}
            >
              <option value="" disabled>
                Seleccione una especialización
              </option>
              <option value="Programación">Programación</option>
              <option value="BDD">Base de datos</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Diseño y UX">Diseño y UX</option>
              <option value="Marketing">Marketing</option>
              <option value="Inteligencia Artificial">
                Inteligencia Artificial
              </option>
              <option value="Desarrollo">Desarrollo</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="numTelefono">Teléfono:</label>
        <input
          type="tel"
          name="numTelefono"
          value={formData.numTelefono}
          onChange={handleChange}
          placeholder="Tu teléfono"
        />
      </div>

      <div className="form-group">
        <label htmlFor="redes">Redes Sociales:</label>
        <input
          name="redes"
          value={formData.redes}
          onChange={handleChange}
          placeholder="@usuario"
        />
      </div>

      <div className="form-group">
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

      <div className="form-group">
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
    </>
  );
}

export default ProfileGrid;
