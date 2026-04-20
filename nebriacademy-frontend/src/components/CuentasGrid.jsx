// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import "../styles/Cuentas.css"
// ── COMPONENTE ──────────────────────────────────────────────────────────────
function CuentasGrid() {
  const { tipo } = useAuthStore();

  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario para crear cuenta
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("alumno");

  // Estado para el buscador
  const [filtros, setFiltros] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    numTelefono: '',
    pais: '',
    localidad: ''
  });

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tipo !== "administrador") return;
    fetchCuentas();
  }, [tipo]);

  // Carga paralela de alumnos y profesores y unifica la lista
  const fetchCuentas = async () => {
    setLoading(true);
    try {
      const [resAlumnos, resProfesores] = await Promise.all([
        fetch(`${API_URL}/alumnos`),
        fetch(`${API_URL}/profesores`),
      ]);

      const dataAlumnos = await resAlumnos.json();
      const dataProfesores = await resProfesores.json();

      const arrayAlumnos = Array.isArray(dataAlumnos.Alumnos)
        ? dataAlumnos.Alumnos
        : [];
      const arrayProfesores = Array.isArray(dataProfesores.Profesores)
        ? dataProfesores.Profesores
        : [];

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
    if (rol === "alumno" && !email.endsWith("@alumnos.nebrija.es")) {
      return alert("El email del alumno debe acabar en @alumnos.nebrija.es");
    }

    const contrasenaGenerada = generarContrasena();

    const endpoint =
      rol === "alumno"
        ? `${API_URL}/alumnos/admin/crear`
        : `${API_URL}/profesores/admin/crear`;

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
      fetchCuentas();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Borrar cuenta — los alumnos vinculados no se pueden borrar de forma independiente
  const handleBorrarCuenta = async (cuentaId, rolCuenta, esVinculado) => {
    if (rolCuenta === "alumno" && esVinculado) {
      return alert(
        "No puedes borrar la versión alumno de un profesor de forma independiente.\nPara eliminar esta cuenta, borra la cuenta de profesor a la que está vinculada.",
      );
    }

    if (
      !window.confirm(
        rolCuenta === "profesor"
          ? "¿Estás seguro? Se borrará el profesor Y su cuenta de alumno vinculada, además de todos los contenidos asociados."
          : "¿Estás seguro de que quieres borrar esta cuenta? Se borrarán todos los datos y contenidos dependientes en cascada.",
      )
    ) {
      return;
    }

    const endpoint =
      rolCuenta === "alumno"
        ? `${API_URL}/alumnos/${cuentaId}`
        : `${API_URL}/profesores/${cuentaId}`;

    try {
      const respuesta = await fetch(endpoint, { method: "DELETE" });

      if (respuesta.ok) {
        // Si se borró un profesor, también eliminar su alumno vinculado de la vista local
        const cuenta = cuentas.find(
          (c) => c.id === cuentaId && c.rol === rolCuenta,
        );
        setCuentas((prev) => {
          let resultado = prev.filter(
            (c) => !(c.id === cuentaId && c.rol === rolCuenta),
          );
          if (rolCuenta === "profesor" && cuenta?.alumnoVinculadoId) {
            resultado = resultado.filter(
              (c) =>
                !(
                  c.id === cuenta.alumnoVinculadoId && c.rol === "alumno"
                ),
            );
          }
          return resultado;
        });
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

  // Actualiza los datos in-line y, si es un profesor, sincroniza al alumno vinculado
  const handleUpdateDato = async (cuentaId, rolCuenta, campo, nuevoValor) => {
    const endpoint =
      rolCuenta === "alumno"
        ? `${API_URL}/alumnos/${cuentaId}`
        : `${API_URL}/profesores/${cuentaId}`;

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
        e.target.innerText = oldVal || "";
        return;
      }

      const ok = await handleUpdateDato(id, rolCuenta, campo, newVal);
      if (!ok) {
        e.target.innerText = oldVal || "";
      } else {
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

  // Separar alumnos básicos, alumnos vinculados y profesores
  const alumnosBasicos = cuentas.filter(
    (c) => c.rol === "alumno" && !c.esVinculado,
  );
  const alumnosVinculados = cuentas.filter(
    (c) => c.rol === "alumno" && c.esVinculado,
  );
  const profesores = cuentas.filter((c) => c.rol === "profesor");

  // Filtrar por términos de búsqueda
  const filteredAlumnosBasicos = alumnosBasicos.filter((c) =>
    (!filtros.nombre || (c.nombre || '').toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (!filtros.apellidos || (c.apellidos || '').toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
    (!filtros.email || (c.email || '').toLowerCase().includes(filtros.email.toLowerCase())) &&
    (!filtros.dni || (c.dni || '').toLowerCase().includes(filtros.dni.toLowerCase())) &&
    (!filtros.numTelefono || (c.numTelefono || '').toLowerCase().includes(filtros.numTelefono.toLowerCase())) &&
    (!filtros.pais || (c.pais || '').toLowerCase().includes(filtros.pais.toLowerCase())) &&
    (!filtros.localidad || (c.localidad || '').toLowerCase().includes(filtros.localidad.toLowerCase()))
  );
  const filteredProfesores = profesores.filter((c) =>
    (!filtros.nombre || (c.nombre || '').toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (!filtros.apellidos || (c.apellidos || '').toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
    (!filtros.email || (c.email || '').toLowerCase().includes(filtros.email.toLowerCase())) &&
    (!filtros.dni || (c.dni || '').toLowerCase().includes(filtros.dni.toLowerCase())) &&
    (!filtros.numTelefono || (c.numTelefono || '').toLowerCase().includes(filtros.numTelefono.toLowerCase())) &&
    (!filtros.pais || (c.pais || '').toLowerCase().includes(filtros.pais.toLowerCase())) &&
    (!filtros.localidad || (c.localidad || '').toLowerCase().includes(filtros.localidad.toLowerCase()))
  );
  const filteredAlumnosVinculados = alumnosVinculados.filter((c) =>
    (!filtros.nombre || (c.nombre || '').toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (!filtros.apellidos || (c.apellidos || '').toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
    (!filtros.dni || (c.dni || '').toLowerCase().includes(filtros.dni.toLowerCase())) &&
    (!filtros.numTelefono || (c.numTelefono || '').toLowerCase().includes(filtros.numTelefono.toLowerCase())) &&
    (!filtros.pais || (c.pais || '').toLowerCase().includes(filtros.pais.toLowerCase())) &&
    (!filtros.localidad || (c.localidad || '').toLowerCase().includes(filtros.localidad.toLowerCase()))
  );

  // Obtiene el nombre del profesor al que pertenece un alumno vinculado
  const getNombreProfesor = (alumno) => {
    const prof = profesores.find((p) => p.id === alumno.profesorVinculadoId);
    if (!prof) return `ID ${alumno.profesorVinculadoId || "?"}`;
    return `${prof.nombre || ""} ${prof.apellidos || ""}`.trim() || prof.email;
  };

  return (
    <div className="contenedor-cuentas">
      <h2>Gestión de cuentas de usuario</h2>

      {/* Bloque para crear cuentas nuevas de forma parcial */}
      <div className="contenedor-nuevas-cuentas">
        <h3>Crear cuenta</h3>
        <form className="nuevas-form" onSubmit={handleCrearCuenta}>
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
          <button className="btn-cuentas btn-crear" type="submit">Crear cuenta</button>
        </form>
      </div>
      {/* Buscador*/}
      <div className="contenedor-nuevas-cuentas">
        <h3>Filtros de búsqueda</h3>
        <form className="nuevas-form">
          <input
            type="text"
            placeholder="Nombre"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={filtros.apellidos}
            onChange={(e) => setFiltros({ ...filtros, apellidos: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={filtros.email}
            onChange={(e) => setFiltros({ ...filtros, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="DNI"
            value={filtros.dni}
            onChange={(e) => setFiltros({ ...filtros, dni: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nº Teléfono"
            value={filtros.numTelefono}
            onChange={(e) => setFiltros({ ...filtros, numTelefono: e.target.value })}
          />
          <input
            type="text"
            placeholder="País"
            value={filtros.pais}
            onChange={(e) => setFiltros({ ...filtros, pais: e.target.value })}
          />
          <input
            type="text"
            placeholder="Localidad"
            value={filtros.localidad}
            onChange={(e) => setFiltros({ ...filtros, localidad: e.target.value })}
          />
          <button type="button" className="btn-cuentas btn-crear" onClick={() => setFiltros({
            nombre: '',
            apellidos: '',
            email: '',
            dni: '',
            numTelefono: '',
            pais: '',
            localidad: ''
          })}>
            Limpiar filtros
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mensaje-cargando">Cargando cuentas...</p>
      ) : (
        <div className="contenedor-alumnos">
          {/* ── TABLA ALUMNOS BÁSICOS ── */}
          <h3>Alumnos</h3>
          <div className="tabla-contenedor">
            <table className="tabla t-alumnos-basicos">
            <thead className="head-tabla">
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
            <tbody className="contenido-tabla">
              {filteredAlumnosBasicos.length === 0 ? (
                <tr>
                  <td colSpan={11}>No hay alumnos que coincidan con los filtros</td>
                </tr>
              ) : (
                filteredAlumnosBasicos.map((c) => (
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
                      handleBlur(e, c.id, "alumno", "contrasena", c.contrasena)
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
                      handleBlur(e, c.id, "alumno", "numeroTarjeta", c.numeroTarjeta)
                    }
                  >
                    {c.numeroTarjeta || ""}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur(e, c.id, "alumno", "numTelefono", c.numTelefono)
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
                    <button onClick={() => handleBorrarCuenta(c.id, "alumno", c.esVinculado)}>
                      Borrar
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
          </div>

          {/* ── TABLA PROFESORES ── */}
          <h3>Profesores</h3>
          <div className="tabla-contenedor">
            <table className="tabla t-profesores">
            <thead className="head-tabla">
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
            <tbody className="contenido-tabla">
              {filteredProfesores.length === 0 ? (
                <tr>
                  <td colSpan={13}>No hay profesores que coincidan con los filtros</td>
                </tr>
              ) : (
                filteredProfesores.map((c) => (
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
                      handleBlur(e, c.id, "profesor", "apellidos", c.apellidos)
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
                      handleBlur(e, c.id, "profesor", "contrasena", c.contrasena)
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
                      handleBlur(e, c.id, "profesor", "numCuentaBancaria", c.numCuentaBancaria)
                    }
                  >
                    {c.numCuentaBancaria || ""}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur(e, c.id, "profesor", "numTelefono", c.numTelefono)
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
                      handleBlur(e, c.id, "profesor", "localidad", c.localidad)
                    }
                  >
                    {c.localidad || ""}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur(e, c.id, "profesor", "especializacion", c.especializacion)
                    }
                  >
                    {c.especializacion || ""}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur(e, c.id, "profesor", "imagenPerfil", c.imagenPerfil)
                    }
                  >
                    {c.imagenPerfil || ""}
                  </td>
                  <td>
                    <button onClick={() => handleBorrarCuenta(c.id, "profesor", false)}>
                      Borrar
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
          </div>

           {/* ── TABLA ALUMNOS VINCULADOS A PROFESORES ── */}
          <h3>Cuentas alumno de profesores</h3>
          <div className="tabla-contenedor">
            <table className="tabla t-alumnos-vinculados">
            <thead className="head-tabla">
              <tr>
                <th>Profesor vinculado</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>DNI</th>
                <th>Nº Teléfono</th>
                <th>Redes</th>
                <th>País</th>
                <th>Localidad</th>
              </tr>
            </thead>
            <tbody className="contenido-tabla">
              {filteredAlumnosVinculados.length === 0 ? (
                <tr>
                  <td colSpan={8}>No hay alumnos vinculados que coincidan con los filtros</td>
                </tr>
              ) : (
                filteredAlumnosVinculados.map((c) => (
                  <tr key={`alumno-vinculado-${c.id}`}>
                    <td>{getNombreProfesor(c)}</td>
                    <td>{c.nombre || ""}</td>
                    <td>{c.apellidos || ""}</td>
                    <td>{c.dni || ""}</td>
                    <td>{c.numTelefono || ""}</td>
                    <td>{c.redes || ""}</td>
                    <td>{c.pais || ""}</td>
                    <td>{c.localidad || ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuentasGrid;
