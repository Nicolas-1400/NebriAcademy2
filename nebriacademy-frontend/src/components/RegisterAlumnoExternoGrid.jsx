// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// RegisterAlumnoExternoGrid: Formulario de inscripción para alumnos sin afiliación previa a Nebrija.
// Incluye todos los datos personales y el detalle de pago (tarjeta de crédito).
function RegisterAlumnoExternoGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();

  // Objeto central que almacena y sincroniza la información completada en el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    email: "",
    contrasena: "",
    numeroTarjeta: "",
    pais: "",
    localidad: "",
  });

  const [error, setError] = useState("");

  // ==========================================
  // 4. FUNCIONES Y HANDLERS
  // ==========================================
  // Vincula los cambios en los inputs con la propiedad correspondiente del estado formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ejecuta la petición POST de alta de cuenta enviando formData al backend
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/alumnos/registerAlumnoExterno/auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // En caso de creación correcta de cuenta, envía al usuario al login
        navigate("/");
      } else {
        setError(datos.error || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <div className="register-grid-externo">
      {/* Columna Izquierda: Formulario de Registro */}
      <div className="formulario-register-contenedor">
        <h2>Registrate</h2>

        <form className="formulario-register" onSubmit={handleRegister}>
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            name="apellidos"
            type="text"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
          <input
            name="dni"
            type="text"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <input
            name="numeroTarjeta"
            type="text"
            placeholder="Tarjeta"
            value={formData.numeroTarjeta}
            onChange={handleChange}
            required
          />

          <select
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            required
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

          <select
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
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

          {error && <p className="error-login">{error}</p>}

          <button type="submit">Registrarse</button>
        </form>

        <p>
          ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
        </p>
      </div>

      {/* Columna Derecha: Información comercial / Beneficios */}
      <div className="register-precios">
        <h2>Precio</h2>
        <div className="precios-contenido">
          <div className="precio">Por solo 5.99€/mes.</div>
          <div className="descripcion-precio">
            <p>Acceso completo a nuestra plataforma educativa:</p>
            <ul>
              <li>📚 Acceso ilimitado a todos los cursos disponibles</li>
              <li>📖 Materiales de estudio exclusivos y actualizados</li>
              <li>🎥 Videos tutoriales y clases grabadas</li>
              <li>✏️ Ejercicios prácticos con retroalimentación</li>
              <li>📝 Apuntes descargables en PDF</li>
              <li>🏆 Seguimiento de tu progreso académico</li>
              <li>💬 Soporte y comunicación con profesores</li>
              <li>🎓 Certificados de finalización de cursos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. EXPORTACIONES
// ==========================================
export default RegisterAlumnoExternoGrid;
