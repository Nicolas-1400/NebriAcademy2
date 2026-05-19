// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente unificado para los formularios de registro (alumno externo, alumno Nebrija y profesor)
function RegisterGrid({ tipo }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado del formulario que agrupa todos los campos de registro
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
  // Bloqueo para evitar envíos duplicados durante el registro de usuarios.
  const locksRef = useRef({});
  const acquireLock = (key, delay = 800) => {
    if (locksRef.current[key]) return false;
    locksRef.current[key] = true;
    setTimeout(() => delete locksRef.current[key], delay);
    return true;
  };

  // Campos según rol: alumnoexterno requiere tarjeta; alumnonebrija usa email precargado; profesor requiere IBAN y especialización

  // ── EFECTOS ─────────────────────────────────────────────────────────────────
  // Si el rol requiere verificación previa (Nebrija o Profesor), precarga el email verificado o redirige al paso anterior
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
  }, [tipo, location.state, navigate]);

  // ── FUNCIONES ───────────────────────────────────────────────────────────────
  // Actualiza dinámicamente el estado del formulario según el input modificado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Procesa el registro dependiendo del tipo de usuario, eliminando los campos innecesarios antes de enviar a la API
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!acquireLock(`register-${tipo}`)) return;

    // Determina endpoint y elimina campos no relevantes según el rol
    let endpoint = "";
    let dataToSend = { ...formData };

    // Configuración del endpoint y payload según el rol
    if (tipo === "alumnoexterno") {
      endpoint = "/alumnos/registerAlumnoExterno/auth";
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
        // Limpia el storage temporal y redirige al login
        if (tipo === "alumnonebrija") sessionStorage.removeItem("verifiedStudentEmail");
        else if (tipo === "profesor") sessionStorage.removeItem("verifiedProfessorEmail");
        
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
  // Bloquea la edición del email si viene del paso de verificación
  const isEmailDisabled = tipo === "alumnonebrija" || tipo === "profesor";

  return (
    <div className="auth-grid register-ext">
      <div className="auth-form-container">
        <h2>Regístrate</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          
          {/* Inputs bloqueados para usuarios verificados previamente */}
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
              placeholder={tipo === "alumnonebrija" ? "Nueva contraseña" : "Nueva Contraseña"}
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          )}

          {/* Inputs comunes para todos los roles */}
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

          {/* Inputs exclusivos para alumnos externos */}
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

          {/* Input exclusivo para profesores */}
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

          <select name="pais" value={formData.pais} onChange={handleChange} required>
            <option value="" disabled>Seleccione un país</option>
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

          <select name="localidad" value={formData.localidad} onChange={handleChange} required>
            <option value="" disabled>Seleccione una localidad</option>
            <option value="Madrid">Madrid</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Valencia">Valencia</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Bilbao">Bilbao</option>
            <option value="Otro">Otro</option>
          </select>

          {/* Select exclusivo de especialización para profesores */}
          {tipo === "profesor" && (
            <select name="especializacion" value={formData.especializacion} onChange={handleChange} required>
              <option value="" disabled>Seleccione una especialización</option>
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

          {error && <p className="register-error-message">{error}</p>}
          <button type="submit">
            {tipo === "profesor" ? "Completar Registro" : "Registrarse"}
          </button>
        </form>

        <p>¿Ya tienes cuenta? <a href="/">Inicia sesión</a></p>
      </div>

      {/* Banner de precios solo para alumnos externos */}
      {tipo === "alumnoexterno" && (
        <div className="register-pricing">
          <h2>Precio</h2>
          <div className="pricing-content">
            <div className="price">Por solo 5.99€/mes.</div>
            <div className="price-description">
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
