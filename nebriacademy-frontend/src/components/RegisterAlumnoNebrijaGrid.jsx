import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Componente: RegisterAlumnoNebrijaGrid
 * Formulario para completar registro de alumnos verificados (Nebrija).
 */
function RegisterAlumnoNebrijaGrid() {
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
    const emailToUse = location.state?.email || verifiedEmail;

    if (emailToUse) {
      setFormData((prev) => ({ ...prev, email: emailToUse }));
    } else {
      navigate("/Register/VerificacionAlumnoNebrija");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        sessionStorage.removeItem("verifiedStudentEmail");
        navigate("/");
      } else {
        setError(datos.error || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <h2>Regístrate</h2>
        <form className="formulario-login" onSubmit={handleRegister}>
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

export default RegisterAlumnoNebrijaGrid;
