import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfilDefault from "../assets/imagenPerfilUsuario.png";
import TarjetaImagenPerfil, { PERFILES } from "./TarjetaImagenPerfil";
import "../styles/TarjetaImagenPerfil.css";

function PerfilProfesorGrid() {
  const navigate = useNavigate();
  const { user, setUser, tipo } = useAuthStore();

  // Estados
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    contrasena: "",
    numCuentaBancaria: "",
    numTelefono: "",
    redes: "",
    pais: "",
    localidad: "",
    especializacion: "",
    imagenPerfil: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  // Efectos
  useEffect(() => {
    if (!user || tipo !== "profesor") return;

    fetch(`http://localhost:3000/usuarios/${user.id}?tipo=profesor`)
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        const datosIniciales = datos || user;
        if (datos) setUser(datos, "profesor");

        setFormData({
          nombre: datosIniciales.nombre || "",
          apellidos: datosIniciales.apellidos || "",
          contrasena: "",
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

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (nombreImagen) => {
    setFormData((prev) => ({ ...prev, imagenPerfil: nombreImagen }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");
    setLoading(true);

    try {
      const payload = { ...formData, tipo: "profesor" };
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
        setUser(usuarioActualizado, "profesor");
        setFormData((prev) => ({ ...prev, contrasena: "" }));
        setMensajeExito("¡Perfil actualizado correctamente!");
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        const datosError = await respuesta.json();
        throw new Error(datosError.error || "Error al actualizar perfil");
      }
    } catch (error) {
      setMensajeError(e.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  // Resolver imagen de perfil
  const imagenMostrar =
    formData.imagenPerfil && PERFILES[formData.imagenPerfil]
      ? PERFILES[formData.imagenPerfil]
      : ImagenPerfilDefault;

  return (
    <div className="perfil">
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
        {user.especializacion && (
          <p className="especializacionPerfil">📚 {user.especializacion}</p>
        )}
        {user.numTelefono && <p className="telPerfil">📱 {user.numTelefono}</p>}
        {user.pais && <p className="paisPerfil">🌍 {user.pais}</p>}
        {user.localidad && (
          <p className="localidadPerfil">🏙️ {user.localidad}</p>
        )}
      </div>

      <div className="formularioEditarPerfil">
        <h3>Editar Perfil</h3>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

        <form onSubmit={handleSubmit} className="formulario-profesor">
          {/* SECCIÓN SUPERIOR: Imagen + Datos Principales */}
          <div className="seccion-superior-form">
            <div className="columna-imagen">
              <label className="label-seccion">Imagen de Perfil:</label>
              <TarjetaImagenPerfil
                imagenSeleccionada={formData.imagenPerfil}
                onSelect={handleImageSelect}
              />
            </div>

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

export default PerfilProfesorGrid;
