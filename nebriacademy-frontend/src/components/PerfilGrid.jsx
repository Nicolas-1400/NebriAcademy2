import { useEffect, useState } from "react";
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";

function PerfilGrid() {
  const [usuario, setUsuario] = useState(null);
  const storeUser = useAuthStore(state => state.user)
  const tipo = useAuthStore(state => state.tipo)
  const setUser = useAuthStore(state => state.setUser)
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
  useEffect(() => {
    if (!storeUser) return
    if (tipo !== 'alumno') return

    setUsuario(storeUser)

    fetch(`http://localhost:3000/usuarios/${storeUser.id}?tipo=alumno`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener datos del usuario')
        return response.json()
      })
      .then((datosCompletos) => {
        setUsuario(datosCompletos)
        setUser(datosCompletos, 'alumno')

        setFormData({
          nombre: datosCompletos.nombre || "",
          apellidos: datosCompletos.apellidos || "",
          contrasena: "",
          numeroTarjeta: datosCompletos.numeroTarjeta || "",
          numTelefono: datosCompletos.numTelefono || "",
          redes: datosCompletos.redes || "",
          pais: datosCompletos.pais || "",
          localidad: datosCompletos.localidad || "",
        })
      })
      .catch(() => {
        setFormData((prev) => ({
          ...prev,
          nombre: storeUser.nombre || "",
          apellidos: storeUser.apellidos || "",
          contrasena: "",
          numeroTarjeta: storeUser.numeroTarjeta || "",
          numTelefono: storeUser.numTelefono || "",
          redes: storeUser.redes || "",
          pais: storeUser.pais || "",
          localidad: storeUser.localidad || "",
        }))
      })
  }, [storeUser, tipo, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    try {
      const datosActualizar = {
        ...formData,
        tipo: "alumno",
      };

      if (!formData.contrasena) {
        delete datosActualizar.contrasena;
      }

      const response = await fetch(
        `http://localhost:3000/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizar),
        },
      );

      if (response.ok) {
        const usuarioActualizado = await response.json();
        setUser(usuarioActualizado, 'alumno')
        setUsuario(usuarioActualizado);
        setMensajeExito("¡Perfil actualizado correctamente!");
        setFormData((prevState) => ({
          ...prevState,
          contrasena: "",
        }));
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        const error = await response.json();
        setMensajeError(error.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      setMensajeError("Error al conectar con el servidor");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="perfil">
      <div className="datosPerfil">
        <h1>Mi Perfil</h1>
        <img className="imagenPerfil" src={ImagenPerfil} alt="Perfil Usuario" />
        <h2 className="nombrePerfil">
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h2>
        <p className="correoPerfil">
          {usuario ? usuario.email : "correo@example.com"}
        </p>
        <p className="tipoPerfil">Alumno</p>
        {usuario?.numTelefono && (
          <p className="telPerfil">📱 {usuario.numTelefono}</p>
        )}
        {usuario?.pais && <p className="paisPerfil">🌍 {usuario.pais}</p>}
        {usuario?.localidad && (
          <p className="localidadPerfil">🏙️ {usuario.localidad}</p>
        )}
      </div>
      <div className="formularioEditarPerfil">
        <h3>Editar Perfil</h3>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="formulario-grupo">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Tu nombre"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Tus apellidos"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
            <input
              type="text"
              id="numeroTarjeta"
              name="numeroTarjeta"
              value={formData.numeroTarjeta}
              onChange={handleInputChange}
              placeholder="Tu número de tarjeta"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="numTelefono">Número de Teléfono:</label>
            <input
              type="tel"
              id="numTelefono"
              name="numTelefono"
              value={formData.numTelefono}
              onChange={handleInputChange}
              placeholder="Tu número de teléfono"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="redes">Redes Sociales:</label>
            <input
              type="text"
              id="redes"
              name="redes"
              value={formData.redes}
              onChange={handleInputChange}
              placeholder="Tus redes sociales (ej: @usuario)"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="pais">País:</label>
            <select id="pais" name="pais" value={formData.pais} onChange={handleInputChange}>
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
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
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

          <button type="submit" className="boton-editar-perfil">
            Guardar Cambios
          </button>
          <button className="boton-go-back" onClick={() => navigate(-1)}>
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default PerfilGrid;
