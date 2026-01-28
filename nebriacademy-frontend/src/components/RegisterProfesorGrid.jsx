import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterProfesorGrid() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [numeroCuentaBancaria, setCuentaBancaria] = useState("");
  const [pais, setPais] = useState("");
  const [localidad, setLocalizacion] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/registerProfesor/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre,
            apellidos: apellidos,
            dni: dni,
            email: email,
            contrasena: contrasena,
            numeroCuentaBancaria: numeroCuentaBancaria,
            pais: pais,
            localidad: localidad,
            especializacion: especializacion,
          }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("Registro exitoso:", datos);
        navigate("/");
      } else {
        setError(datos.error || "Error en el registro");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Cuenta Bancaria"
            value={numeroCuentaBancaria}
            onChange={(e) => setCuentaBancaria(e.target.value)}
            required
          />
          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
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
            value={localidad}
            onChange={(e) => setLocalizacion(e.target.value)}
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
            value={especializacion}
            onChange={(e) => setEspecializacion(e.target.value)}
            required
          >
            <option value="" disabled>
              Seleccione una especialización
            </option>
            <option value="Programacion">Programación</option>
            <option value="Diseno">Diseño</option>
            <option value="Ciberseguridad">Ciberseguridad</option>
            <option value="BDD">Base de datos</option>
            <option value="Marketing">Marketing</option>
          </select>

          {error && <p className="error-login">{error}</p>}
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProfesorGrid;
