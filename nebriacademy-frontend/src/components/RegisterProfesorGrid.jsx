import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RegisterProfesorGrid() {
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

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
    const emailToUse = location.state?.email || verifiedEmail;

    if (emailToUse) {
      setFormData((prev) => ({ ...prev, email: emailToUse }));
    } else {
      navigate("/Register/VerificacionProfesor");
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
        "http://localhost:3000/profesores/verificacionprofesor/completar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
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

  return (
    <div className="register-grid-externo">
      <div className="formulario-register-contenedor">
        <h2>Regístrate (Profesor)</h2>
        <form className="formulario-register" onSubmit={handleRegister}>
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

export default RegisterProfesorGrid;
