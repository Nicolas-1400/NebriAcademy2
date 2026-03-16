// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function CuentasGrid() {
  const { tipo } = useAuthStore();

  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario para crear cuenta
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("alumno");

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Si no es un administrador, en teoría el ProtectedRoute ya lo bloquea, pero por seguridad
    if (tipo !== "administrador") return;
    fetchCuentas();
  }, [tipo]);

  // Carga paralela de alumnos y profesores y unifica la lista
  const fetchCuentas = async () => {
    setLoading(true);
    try {
      const [resAlumnos, resProfesores] = await Promise.all([
        fetch("http://localhost:3000/alumnos"),
        fetch("http://localhost:3000/profesores"),
      ]);

      const dataAlumnos = await resAlumnos.json();
      const dataProfesores = await resProfesores.json();

      const arrayAlumnos = Array.isArray(dataAlumnos.Alumnos)
        ? dataAlumnos.Alumnos
        : [];
      const arrayProfesores = Array.isArray(dataProfesores.Profesores)
        ? dataProfesores.Profesores
        : [];

      // Mapeamos para que ambas listas tengan la misma forma básica para mostrarlas
      const formateadas = [
        ...arrayAlumnos.map((a) => ({ ...a, rol: "alumno" })),
        ...arrayProfesores.map((p) => ({ ...p, rol: "profesor" })),
      ];

      setCuentas(formateadas);
    } catch (error) {
      console.error("Error al cargar cuentas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generador de contraseñas de 8 caracteres alfanuméricos
  const generarContrasena = () => {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contrasena = "";
    for (let i = 0; i < 8; i++) {
      contrasena += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length),
      );
    }
    return contrasena;
  };

  // Envía una petición para crear una cuenta parcial (solo email y contraseña temporal)
  const handleCrearCuenta = async (e) => {
    e.preventDefault();
    if (!email) return alert("Email obligatorio");

    const contrasenaGenerada = generarContrasena();

    const endpoint =
      rol === "alumno"
        ? "http://localhost:3000/alumnos/admin/crear"
        : "http://localhost:3000/profesores/admin/crear";

    try {
      const respuesta = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: contrasenaGenerada }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok)
        throw new Error(datos.error || "Error al crear la cuenta");

      alert(
        `Cuenta de ${rol} creada correctamente.\n\nContraseña generada: ${contrasenaGenerada}`,
      );
      setEmail("");
      fetchCuentas(); // recarga la lista
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Petición DELETE en cascada y actualiza estado local
  const handleBorrarCuenta = async (cuentaId, rolCuenta) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres borrar esta cuenta? Se borrarán todos los datos y contenidos dependientes en cascada.",
      )
    ) {
      return;
    }

    const endpoint =
      rolCuenta === "alumno"
        ? `http://localhost:3000/alumnos/${cuentaId}`
        : `http://localhost:3000/profesores/${cuentaId}`;

    try {
      const respuesta = await fetch(endpoint, {
        method: "DELETE",
      });

      if (respuesta.ok) {
        setCuentas((prev) =>
          prev.filter((c) => !(c.id === cuentaId && c.rol === rolCuenta)),
        );
        alert("Cuenta borrada con éxito.");
      } else {
        const d = await respuesta.json();
        alert(d.error || "No se pudo borrar la cuenta");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  // Actualiza los datos in-line (en vivo)
  const handleUpdateDato = async (cuentaId, rolCuenta, campo, nuevoValor) => {
    const endpoint =
      rolCuenta === "alumno"
        ? `http://localhost:3000/alumnos/${cuentaId}`
        : `http://localhost:3000/profesores/${cuentaId}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: nuevoValor }),
      });

      if (!res.ok) {
        alert("Error al actualizar ese dato");
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      alert("Error de red");
      return false;
    }
  };

  // Llamado cuando se pierde el foco en un input de la tabla
  const handleBlur = async (e, id, rolCuenta, campo, oldVal) => {
    const newVal = e.target.innerText.trim();
    if (newVal !== (oldVal || "").trim()) {
      if (
        !window.confirm(
          `¿Estás seguro de que quieres guardar el cambio de "${oldVal || ""}" a "${newVal}"?`,
        )
      ) {
        // revierte cambios si cancela
        e.target.innerText = oldVal || "";
        return;
      }

      const ok = await handleUpdateDato(id, rolCuenta, campo, newVal);
      if (!ok) {
        // revierte cambios si falló la actualización
        e.target.innerText = oldVal || "";
      } else {
        // actualiza el estado local
        setCuentas((prev) =>
          prev.map((c) => {
            if (c.id === id && c.rol === rolCuenta) {
              return { ...c, [campo]: newVal };
            }
            return c;
          }),
        );
      }
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (tipo !== "administrador") {
    return <p>Acceso denegado.</p>;
  }

  return (
    <div>
      <h2>Gestión de cuentas de usuario</h2>

      {/* Bloque para crear cuentas nuevas de forma parcial */}
      <div>
        <h3>Crear cuenta</h3>
        <form onSubmit={handleCrearCuenta}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="alumno">Alumno</option>
            <option value="profesor">Profesor</option>
          </select>
          <button type="submit">Crear cuenta</button>
        </form>
      </div>

      {loading ? (
        <p>Cargando cuentas...</p>
      ) : (
        <div>
          <h3>Alumnos</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>DNI</th>
                <th>Nº Tarjeta</th>
                <th>Nº Teléfono</th>
                <th>Redes</th>
                <th>País</th>
                <th>Localidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas
                .filter((c) => c.rol === "alumno")
                .map((c) => (
                  <tr key={`alumno-${c.id}`}>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "nombre", c.nombre)
                      }
                    >
                      {c.nombre || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "apellidos", c.apellidos)
                      }
                    >
                      {c.apellidos || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "email", c.email)
                      }
                    >
                      {c.email || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "alumno",
                          "contrasena",
                          c.contrasena,
                        )
                      }
                    >
                      {c.contrasena || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "dni", c.dni)
                      }
                    >
                      {c.dni || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "alumno",
                          "numeroTarjeta",
                          c.numeroTarjeta,
                        )
                      }
                    >
                      {c.numeroTarjeta || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "alumno",
                          "numTelefono",
                          c.numTelefono,
                        )
                      }
                    >
                      {c.numTelefono || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "redes", c.redes)
                      }
                    >
                      {c.redes || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "pais", c.pais)
                      }
                    >
                      {c.pais || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "alumno", "localidad", c.localidad)
                      }
                    >
                      {c.localidad || ""}
                    </td>
                    <td>
                      <button
                        onClick={() => handleBorrarCuenta(c.id, "alumno")}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3>Profesores</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>DNI</th>
                <th>Cuenta Bancaria</th>
                <th>Nº Teléfono</th>
                <th>Redes</th>
                <th>País</th>
                <th>Localidad</th>
                <th>Especialización</th>
                <th>Imagen Perfil</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas
                .filter((c) => c.rol === "profesor")
                .map((c) => (
                  <tr key={`profesor-${c.id}`}>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "profesor", "nombre", c.nombre)
                      }
                    >
                      {c.nombre || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "apellidos",
                          c.apellidos,
                        )
                      }
                    >
                      {c.apellidos || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "profesor", "email", c.email)
                      }
                    >
                      {c.email || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "contrasena",
                          c.contrasena,
                        )
                      }
                    >
                      {c.contrasena || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "profesor", "dni", c.dni)
                      }
                    >
                      {c.dni || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "numCuentaBancaria",
                          c.numCuentaBancaria,
                        )
                      }
                    >
                      {c.numCuentaBancaria || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "numTelefono",
                          c.numTelefono,
                        )
                      }
                    >
                      {c.numTelefono || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "profesor", "redes", c.redes)
                      }
                    >
                      {c.redes || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(e, c.id, "profesor", "pais", c.pais)
                      }
                    >
                      {c.pais || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "localidad",
                          c.localidad,
                        )
                      }
                    >
                      {c.localidad || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "especializacion",
                          c.especializacion,
                        )
                      }
                    >
                      {c.especializacion || ""}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleBlur(
                          e,
                          c.id,
                          "profesor",
                          "imagenPerfil",
                          c.imagenPerfil,
                        )
                      }
                    >
                      {c.imagenPerfil || ""}
                    </td>
                    <td>
                      <button
                        onClick={() => handleBorrarCuenta(c.id, "profesor")}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CuentasGrid;
