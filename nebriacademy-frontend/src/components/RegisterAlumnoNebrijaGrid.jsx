// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// RegisterAlumnoNebrijaGrid: Paso final tras validar la pertenencia a Nebrija.
// Captura la contraseña, nombre y demás datos demográficos vinculándolos al correo institucional verificado.
function RegisterAlumnoNebrijaGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();
  const location = useLocation();

  // Estado consolidado para los campos del formulario. El 'email' vendrá pre-cargado.
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    contrasena: "",
    email: "",
    pais: "",
    localidad: "",
  });

  const [error, setError] = useState("");

  // ==========================================
  // 4. EFECTOS
  // ==========================================
  // Validamos que el usuario realmente cruzó el proceso de verificación.
  // Rescata el email desde location.state o sessionStorage para asignarlo al formulario.
  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
    const emailToUse = location.state?.email || verifiedEmail;

    if (emailToUse) {
      setFormData((prev) => ({ ...prev, email: emailToUse }));
    } else {
      // Si no existe correo validado, lo expulsa de nuevo a la pantalla de verificación
      navigate("/Register/VerificacionAlumnoNebrija");
    }
  }, [location.state, navigate]);

  // ==========================================
  // 5. FUNCIONES Y HANDLERS
  // ==========================================
  // Sincroniza los valores de los inputs con el objeto de estado general
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Empaqueta los datos y solicita al backend el alta del perfil de Alumno
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/alumnos/verificacionnebrija/completar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Limpiamos la prueba de verificación del navegador para no reusarla accidentalmente
        sessionStorage.removeItem("verifiedStudentEmail");
        // Deriva al login público para su acceso
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
  // 6. RENDERIZADO
  // ==========================================
  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <h2>Regístrate</h2>
        <form className="formulario-login" onSubmit={handleRegister}>
          {/* Email bloqueado (readOnly/disabled) por seguridad tras su validación */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            disabled
            readOnly
          />
          <input
            name="contrasena"
            type="password"
            placeholder="Nueva contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
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
    </div>
  );
}

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default RegisterAlumnoNebrijaGrid;
