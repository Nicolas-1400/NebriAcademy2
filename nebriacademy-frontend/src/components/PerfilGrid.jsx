// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Perfil del alumno: muestra sus datos y permite editarlos
function PerfilGrid() {
  const navigate = useNavigate();
  const { user, setUser, tipo } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado del formulario de edición
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    contrasena: "",
    numeroTarjeta: "",
    numTelefono: "",
    redes: "",
    pais: "",
    localidad: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos los datos más recientes del alumno desde la API y los precargamos en el formulario
  useEffect(() => {
    if (!user || tipo !== "alumno") return;

    fetch(`http://localhost:3000/usuarios/${user.id}?tipo=alumno`)
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        const datosIniciales = datos || user;
        // Actualizamos también el store global para que el Nav muestre datos frescos
        if (datos) setUser(datos, "alumno");

        setFormData({
          nombre: datosIniciales.nombre || "",
          apellidos: datosIniciales.apellidos || "",
          contrasena: "",
          numeroTarjeta: datosIniciales.numeroTarjeta || "",
          numTelefono: datosIniciales.numTelefono || "",
          redes: datosIniciales.redes || "",
          pais: datosIniciales.pais || "",
          localidad: datosIniciales.localidad || "",
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

  // Envía los cambios al backend. Si la contraseña está vacía, no se incluye en el payload(subida).
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");
    setLoading(true);

    try {
      const payload = { ...formData, tipo: "alumno" };
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
        const usuarioActualizado = await respuesta.json();
        setUser(usuarioActualizado, "alumno");
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

  return (
    <div className="perfil">
      {/* Panel izquierdo: datos de solo lectura del alumno */}
      <div className="datosPerfil">
        <h1>Mi Perfil</h1>
        <img className="imagenPerfil" src={ImagenPerfil} alt="Perfil Usuario" />
        <h2 className="nombrePerfil">{`${user.nombre || ""} ${user.apellidos || ""}`}</h2>
        {!user.esVinculado && <p className="correoPerfil">{user.email}</p>}
        <p className="tipoPerfil">{user.esVinculado ? "Alumno (cuenta vinculada)" : "Alumno"}</p>

        {user.numTelefono && <p className="telPerfil">📱 {user.numTelefono}</p>}
        {user.pais && <p className="paisPerfil">🌍 {user.pais}</p>}
        {user.localidad && (
          <p className="localidadPerfil">🏙️ {user.localidad}</p>
        )}
      </div>

      {/* Panel derecho: formulario para editar los datos del perfil */}
      <div className="formularioEditarPerfil">
        <h3>Editar Perfil</h3>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

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

          {/* Contraseña y tarjeta solo para alumnos normales (no vinculados) */}
          {!user.esVinculado && (
            <>
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
            </>
          )}

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

export default PerfilGrid;
