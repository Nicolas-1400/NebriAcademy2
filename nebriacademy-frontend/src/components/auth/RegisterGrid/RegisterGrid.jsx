// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente unificado para los formularios de registro (alumno externo, alumno Nebrija y profesor)
function RegisterGrid({ tipo }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    email: "",
    contrasena: "",
    numeroTarjeta: "",
    numeroCuentaBancaria: "",
    pais: "",
    localidad: "",
    especializacion: "",
  });

  const [error, setError] = useState("");

  // ── EFECTOS ─────────────────────────────────────────────────────────────────
  // Si el tipo requiere verificación previa, cargamos el email y redirigimos si no está
  useEffect(() => {
    if (tipo === "alumnonebrija") {
      const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
      const emailToUse = location.state?.email || verifiedEmail;

      if (emailToUse) {
        setFormData((prev) => ({ ...prev, email: emailToUse }));
      } else {
        navigate("/Register/Verification/alumnonebrija", { replace: true });
      }
    } else if (tipo === "profesor") {
      const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
      const emailToUse = location.state?.email || verifiedEmail;

      if (emailToUse) {
        setFormData((prev) => ({ ...prev, email: emailToUse }));
      } else {
        navigate("/Register/Verification/profesor", { replace: true });
      }
    }
    // Para alumnoexterno no hay verificación previa
  }, [tipo, location.state, navigate]);

  // ── FUNCIONES ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    let endpoint = "";
    let dataToSend = { ...formData };

    if (tipo === "alumnoexterno") {
      endpoint = "/alumnos/registerAlumnoExterno/auth";
      // Limpiamos campos no necesarios
      delete dataToSend.numeroCuentaBancaria;
      delete dataToSend.especializacion;
    } else if (tipo === "alumnonebrija") {
      endpoint = "/alumnos/verificacionnebrija/completar";
      delete dataToSend.numeroTarjeta;
      delete dataToSend.numeroCuentaBancaria;
      delete dataToSend.especializacion;
    } else if (tipo === "profesor") {
      endpoint = "/profesores/verificacionprofesor/completar";
      delete dataToSend.numeroTarjeta;
    }

    try {
      const respuesta = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        if (tipo === "alumnonebrija") {
          sessionStorage.removeItem("verifiedStudentEmail");
        } else if (tipo === "profesor") {
          sessionStorage.removeItem("verifiedProfessorEmail");
        }
        navigate("/");
      } else {
        setError(datos.error || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  const isEmailDisabled = tipo === "alumnonebrija" || tipo === "profesor";

  return (
    <div
      className={
        tipo === "alumnonebrija" ? "login-grid" : "register-grid-externo"
      }
    >
      <div
        className={
          tipo === "alumnonebrija"
            ? "formulario-login-contenedor"
            : "formulario-register-contenedor"
        }
      >
        <h2>Regístrate</h2>
        <form
          className={
            tipo === "alumnonebrija"
              ? "formulario-login"
              : "formulario-register"
          }
          onSubmit={handleRegister}
        >
          {isEmailDisabled && (
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              disabled
              readOnly
            />
          )}

          {isEmailDisabled && (
            <input
              name="contrasena"
              type="password"
              placeholder={
                tipo === "alumnonebrija"
                  ? "Nueva contraseña"
                  : "Nueva Contraseña"
              }
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          )}

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

          {!isEmailDisabled && (
            <>
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
            </>
          )}

          {tipo === "profesor" && (
            <input
              name="numeroCuentaBancaria"
              type="text"
              placeholder="Cuenta Bancaria (IBAN)"
              value={formData.numeroCuentaBancaria}
              onChange={handleChange}
              required
            />
          )}

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

          {tipo === "profesor" && (
            <select
              name="especializacion"
              value={formData.especializacion}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccione una especialización
              </option>
              <option value="Programación">Programación</option>
              <option value="BDD">Base de datos</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Diseño y UX">Diseño y UX</option>
              <option value="Marketing">Marketing</option>
              <option value="Inteligencia Artificial">Inteligencia Artificial</option>
              <option value="Desarrollo">Desarrollo</option>
              <option value="Data Science">Data Science</option>
            </select>
          )}

          {error && <p className="error-login">{error}</p>}
          <button type="submit">
            {tipo === "profesor" ? "Completar Registro" : "Registrarse"}
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
        </p>
      </div>

      {tipo === "alumnoexterno" && (
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
      )}
    </div>
  );
}

export default RegisterGrid;
