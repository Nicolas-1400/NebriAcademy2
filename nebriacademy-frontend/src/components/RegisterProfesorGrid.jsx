// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// RegisterProfesorGrid: Etapa final del alta para docentes.
// Requiere autenticación de correo previo. Carga detalles clave como especialización y datos bancarios.
function RegisterProfesorGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    email: "",
    contrasena: "",
    numeroCuentaBancaria: "",
    pais: "",
    localidad: "",
    especializacion: "",
  });

  const [error, setError] = useState("");

  // ==========================================
  // 4. EFECTOS
  // ==========================================
  // Validación de seguridad para la persistencia del flujo.
  // Exige que el email provenga del sessionStorage o routing (previa verificación de código OTP).
  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
    const emailToUse = location.state?.email || verifiedEmail;

    if (emailToUse) {
      setFormData((prev) => ({ ...prev, email: emailToUse }));
    } else {
      // Redirige al inicio si carece de validación, evitando accesos directos por URL
      navigate("/Register/VerificacionProfesor");
    }
  }, [location.state, navigate]);

  // ==========================================
  // 5. FUNCIONES Y HANDLERS
  // ==========================================
  // Actualiza los datos del objeto general basados en cada tecla o select del usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cierra el proceso confirmando la cuenta contra la base de datos
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/profesores/verificacionprofesor/completar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Purga del testigo temporal y redirección exitosa.
        sessionStorage.removeItem("verifiedProfessorEmail");
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
    <div className="register-grid-externo">
      <div className="formulario-register-contenedor">
        <h2>Regístrate (Profesor)</h2>
        <form className="formulario-register" onSubmit={handleRegister}>
          {/* El email se preserva pero se inhibe su alteración por motivos de validación institucional */}
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
            placeholder="Nueva Contraseña"
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
          <input
            name="numeroCuentaBancaria"
            type="text"
            placeholder="Cuenta Bancaria (IBAN)"
            value={formData.numeroCuentaBancaria}
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

          <select
            name="especializacion"
            value={formData.especializacion}
            onChange={handleChange}
            required
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

          {error && <p className="error-login">{error}</p>}
          <button type="submit">Completar Registro</button>
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
export default RegisterProfesorGrid;
