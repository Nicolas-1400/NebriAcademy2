// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "../../../store/useAuthStore";
import AccountsTable from "../AccountsTable/AccountsTable";
import useToastStore from "../../../store/toastStore";
import useModalStore from "../../../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Panel de administración de cuentas: lista, crea, edita y borra alumnos y profesores
function AccountsGrid() {
  const { tipo } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario para crear cuenta
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("alumno");

  // Estado para el buscador
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    dni: "",
    numTelefono: "",
    pais: "",
    localidad: "",
  });
  // Bloqueo local para evitar envíos duplicados desde la interfaz de administración.
  const locksRef = useRef({});
  const acquireLock = (key, delay = 800) => {
    if (locksRef.current[key]) return false;
    locksRef.current[key] = true;
    setTimeout(() => delete locksRef.current[key], delay);
    return true;
  };

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tipo !== "administrador") return;
    fetchCuentas();
  }, [tipo]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Carga paralela de alumnos y profesores y unifica la lista en un solo array
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
    if (!email) return addToast("Email obligatorio", "error");
    if (rol === "alumno" && !email.endsWith("@alumnos.nebrija.es")) {
      return addToast(
        "El email del alumno debe acabar en @alumnos.nebrija.es",
        "error",
      );
    }

    const contrasenaGenerada = generarContrasena();

    const endpoint =
      rol === "alumno"
        ? `${API_URL}/alumnos/admin/crear`
        : `${API_URL}/profesores/admin/crear`;

    if (!acquireLock(`create-account-${email}`)) return;
    try {
      const respuesta = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: contrasenaGenerada }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok)
        throw new Error(datos.error || "Error al crear la cuenta");

      addToast(
        `Cuenta de ${rol} creada correctamente. Contraseña: ${contrasenaGenerada}`,
        "success",
        6000,
      );
      setEmail("");
      fetchCuentas();
    } catch (error) {
      console.error(error);
      addToast(error.message, "error");
    }
  };

  // Borrar cuenta — los alumnos vinculados no se pueden borrar de forma independiente
  const handleBorrarCuenta = async (cuentaId, rolCuenta, esVinculado) => {
    // Evita envíos duplicados al borrar cuentas
    if (!acquireLock(`delete-account-${cuentaId}`)) return;
    if (rolCuenta === "alumno" && esVinculado) {
      return addToast(
        "No puedes borrar la versión alumno de un profesor de forma independiente. Borra la cuenta de profesor vinculada.",
        "info",
      );
    }

    const reason = await showConfirm(
      rolCuenta === "profesor"
        ? "¿Estás seguro? Se borrará el profesor Y su cuenta de alumno vinculada, además de todos los contenidos asociados."
        : "¿Estás seguro de que quieres borrar esta cuenta? Se borrarán todos los datos y contenidos dependientes en cascada.",
      "Borrar Cuenta",
      { withInput: true },
    );
    if (reason === false) return;

    let endpoint =
      rolCuenta === "alumno"
        ? `${API_URL}/alumnos/${cuentaId}`
        : `${API_URL}/profesores/${cuentaId}`;

    if (typeof reason === "string" && reason.trim()) {
      endpoint += `?reason=${encodeURIComponent(reason)}`;
    }

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
              (c) => !(c.id === cuenta.alumnoVinculadoId && c.rol === "alumno"),
            );
          }
          return resultado;
        });
        addToast("Cuenta borrada con éxito.", "success");
      } else {
        const d = await respuesta.json();
        addToast(d.error || "No se pudo borrar la cuenta", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Error de red", "error");
    }
  };

  // Actualiza los datos in-line y, si es un profesor, sincroniza al alumno vinculado
  const handleUpdateDato = async (cuentaId, rolCuenta, campo, nuevoValor) => {
    if (!acquireLock(`update-${rolCuenta}-${cuentaId}-${campo}`)) return false;
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
        addToast("Error al actualizar ese dato", "error");
        return false;
      }
      addToast("Dato actualizado", "success");
      return true;
    } catch (e) {
      console.error(e);
      addToast("Error de red", "error");
      return false;
    }
  };

  // Llamado cuando se pierde el foco en un input de la tabla
  const handleBlur = async (e, id, rolCuenta, campo, oldVal) => {
    const newVal = e.target.innerText.trim();
    if (newVal !== (oldVal || "").trim()) {
      const confirmed = await showConfirm(
        `¿Estás seguro de que quieres guardar el cambio de "${oldVal || ""}" a "${newVal}"?`,
        "Guardar Cambios",
      );
      if (!confirmed) {
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

  // Obtiene el nombre del profesor al que pertenece un alumno vinculado
  const getNombreProfesor = (alumno) => {
    const prof = profesores.find((p) => p.id === alumno.profesorVinculadoId);
    if (!prof) return `ID ${alumno.profesorVinculadoId || "?"}`;
    return `${prof.nombre || ""} ${prof.apellidos || ""}`.trim() || prof.email;
  };

  const headersAlumnos = [
    "Nombre",
    "Apellidos",
    "Email",
    "Contraseña",
    "DNI",
    "Nº Tarjeta",
    "Nº Teléfono",
    "Redes",
    "País",
    "Localidad",
    "Acciones",
  ];
  const keysAlumnos = [
    "nombre",
    "apellidos",
    "email",
    "contrasena",
    "dni",
    "numeroTarjeta",
    "numTelefono",
    "redes",
    "pais",
    "localidad",
  ];

  const headersProfesores = [
    "Nombre",
    "Apellidos",
    "Email",
    "Contraseña",
    "DNI",
    "Cuenta Bancaria",
    "Nº Teléfono",
    "Redes",
    "País",
    "Localidad",
    "Especialización",
    "Imagen Perfil",
    "Acciones",
  ];
  const keysProfesores = [
    "nombre",
    "apellidos",
    "email",
    "contrasena",
    "dni",
    "numCuentaBancaria",
    "numTelefono",
    "redes",
    "pais",
    "localidad",
    "especializacion",
    "imagenPerfil",
  ];

  const headersVinculados = [
    "Profesor vinculado",
    "Nombre",
    "Apellidos",
    "DNI",
    "Nº Teléfono",
    "Redes",
    "País",
    "Localidad",
  ];
  const keysVinculados = [
    "nombre",
    "apellidos",
    "dni",
    "numTelefono",
    "redes",
    "pais",
    "localidad",
  ];

  return (
    <div className="accounts-container">
      <h2>Gestión de cuentas de usuario</h2>

      {/* Bloque para crear cuentas nuevas de forma parcial */}
      <div className="new-accounts-container">
        <h3>Crear cuenta</h3>
        <form className="new-accounts-form" onSubmit={handleCrearCuenta}>
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
          <button className="accounts-button create-button" type="submit">
            Crear cuenta
          </button>
        </form>
      </div>
      {/* Buscador*/}
      <div className="new-accounts-container">
        <h3>Filtros de búsqueda</h3>
        <form className="new-accounts-form">
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
            onChange={(e) =>
              setFiltros({ ...filtros, apellidos: e.target.value })
            }
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
            onChange={(e) =>
              setFiltros({ ...filtros, numTelefono: e.target.value })
            }
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
            onChange={(e) =>
              setFiltros({ ...filtros, localidad: e.target.value })
            }
          />
          <button
            type="button"
            className="accounts-button create-button"
            onClick={() =>
              setFiltros({
                nombre: "",
                apellidos: "",
                email: "",
                dni: "",
                numTelefono: "",
                pais: "",
                localidad: "",
              })
            }
          >
            Limpiar filtros
          </button>
        </form>
      </div>

      {loading ? (
        <p className="loading-message">Cargando cuentas...</p>
      ) : (
        <div className="tables-container">
          {/* ── TABLA ALUMNOS BÁSICOS ── */}
          <AccountsTable
            title="Alumnos"
            data={alumnosBasicos}
            filtros={filtros}
            headers={headersAlumnos}
            columnKeys={keysAlumnos}
            rol="alumno"
            onBlur={handleBlur}
            onDelete={handleBorrarCuenta}
          />

          {/* ── TABLA PROFESORES ── */}
          <AccountsTable
            title="Profesores"
            data={profesores}
            filtros={filtros}
            headers={headersProfesores}
            columnKeys={keysProfesores}
            rol="profesor"
            onBlur={handleBlur}
            onDelete={handleBorrarCuenta}
          />

          {/* ── TABLA ALUMNOS VINCULADOS A PROFESORES ── */}
          <AccountsTable
            title="Cuentas alumno de profesores"
            data={alumnosVinculados}
            filtros={filtros}
            headers={headersVinculados}
            columnKeys={keysVinculados}
            rol="alumno-vinculado"
            getExtraCol={getNombreProfesor}
          />
        </div>
      )}
    </div>
  );
}

export default AccountsGrid;
