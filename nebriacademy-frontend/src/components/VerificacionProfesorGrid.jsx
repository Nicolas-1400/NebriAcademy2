// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// VerificacionProfesorGrid: Autenticación estricta para candidatos a docentes.
// Evita registros no autorizados obligando al usuario a proveer un código emitido corporativamente.
function VerificacionProfesorGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ==========================================
  // 4. FUNCIONES Y HANDLERS
  // ==========================================
  // Función asíncrona que comprueba la combinación de cuenta y código/contraseña del profesor
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/profesores/verificacionprofesor/auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Validación superada: Guarda la confirmación en sesión y pasa al formulario rico
        sessionStorage.setItem("verifiedProfessorEmail", email);
        navigate("/Register/RegisterProfesor", { state: { email } });
      } else {
        // Atrapa fallos devueltos por lógica de negocio
        setError(datos.error || "Error en la verificación");
      }
    } catch (err) {
      console.error(err);
      // Atrapa caídas del backend
      setError("Error de conexión con el servidor");
    }
  };

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login" onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de verificación"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {error && <p className="error-login">{error}</p>}
          <button type="submit">Verificar Cuenta</button>
        </form>
        <p>
          ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 6. EXPORTACIONES
// ==========================================
export default VerificacionProfesorGrid;
