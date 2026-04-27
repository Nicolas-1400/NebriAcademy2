import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos todas las páginas de la aplicación
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home.jsx";
import MiEspacio from "../pages/MiEspacio.jsx";
import TodosCursos from "../pages/TodosCursos.jsx";
import Curso from "../pages/Curso.jsx";
import AddCurso from "../pages/AddCurso.jsx";
import AddContenidoCurso from "../pages/AddContenidoCurso.jsx";
import EditarContenidoCurso from "../pages/EditarContenidoCurso.jsx";
import CorregirEjerciciosSubidos from "../pages/CorregirEjerciciosSubidos.jsx";
import TodosProfesores from "../pages/TodosProfesores.jsx";
import InfoProfesor from "../pages/InfoProfesor.jsx";
import Apuntes from "../pages/Apuntes.jsx";
import AddApunteIndividual from "../pages/AddApunteIndividual.jsx";
import EditarApunteIndividual from "../pages/EditarApunteIndividual.jsx";
import PreRegister from "../pages/PreRegister.jsx";
import Verificacion from "../pages/Verificacion.jsx";
import RegisterAlumnoNebrija from "../pages/RegisterAlumnoNebrija.jsx";
import RegisterAlumnoExterno from "../pages/RegisterAlumnoExterno.jsx";
import RegisterProfesor from "../pages/RegisterProfesor.jsx";
import Perfil from "../pages/Perfil.jsx";
import Ayuda from "../pages/Ayuda.jsx";
import MisTickets from "../pages/MisTickets.jsx";
import DetalleTicket from "../pages/DetalleTicket.jsx";
import Cuentas from "../pages/Cuentas.jsx";
import Politicas from "../pages/Politicas.jsx";

import ProtectedRoute from "./ProtectedRoute";
import ProtectedVerificationRoute from "./ProtectedVerificationRoute.jsx";
import ProtectedVerificationProfesorRoute from "./ProtectedVerificationProfesorRoute.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas: accesibles sin estar logueado */}
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />

        <Route
          path="/Register/RegisterAlumnoExterno"
          element={<RegisterAlumnoExterno />}
        />

        {/* Flujo de registro para alumnos de Nebrija: verificación → formulario de registro */}
        <Route
          path="/Register/Verificacion/:tipo"
          element={<Verificacion />}
        />
        <Route
          path="/Register/RegisterAlumnoNebrija"
          element={
            // ProtectedVerificationRoute impide acceder al registro sin haber verificado el email primero
            <ProtectedVerificationRoute>
              <RegisterAlumnoNebrija />
            </ProtectedVerificationRoute>
          }
        />
        <Route
          path="/Register/RegisterProfesor"
          element={
            // ProtectedVerificationProfesorRoute impide acceder sin haber verificado el email de profesor
            <ProtectedVerificationProfesorRoute>
              <RegisterProfesor />
            </ProtectedVerificationProfesorRoute>
          }
        />

        {/* Ruta no encontrada: si ninguna ruta coincide, mostramos la página 404 */}
        <Route path="*" element={<NotFound />} />

        {/* Rutas privadas: requieren usuario logueado (ProtectedRoute lo comprueba) */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MiEspacio"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <MiEspacio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Ayuda"
          element={
            <ProtectedRoute>
              <Ayuda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MisTickets"
          element={
            <ProtectedRoute>
              <MisTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MisTickets/:issueKey"
          element={
            <ProtectedRoute>
              <DetalleTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Cursos"
          element={
            <ProtectedRoute requiredTipo={["alumno", "administrador"]}>
              <TodosCursos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Cursos/:id"
          element={
            <ProtectedRoute>
              <Curso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Cursos/:id/AddContenidoCurso"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <AddContenidoCurso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Profesores"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <TodosProfesores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Profesores/:id"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <InfoProfesor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Cuentas"
          element={
            <ProtectedRoute requiredTipo="administrador">
              <Cuentas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Apuntes"
          element={
            <ProtectedRoute>
              <Apuntes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Apuntes/AddApunte"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <AddApunteIndividual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Apuntes/EditarApunte/:id"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <EditarApunteIndividual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Politicas/:tipo"
          element={
            <ProtectedRoute>
              <Politicas />
            </ProtectedRoute>
          }
        />

        {/* Rutas exclusivas de profesor: requieren además que el tipo de usuario sea "profesor" */}
        <Route
          path="/Home/AddCurso"
          element={
            <ProtectedRoute requiredTipo="profesor">
              <AddCurso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Cursos/:id/EditarContenidoCurso"
          element={
            <ProtectedRoute requiredTipo="profesor">
              <EditarContenidoCurso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Cursos/:id/CorregirEjercicios/:id"
          element={
            <ProtectedRoute requiredTipo={["profesor", "administrador"]}>
              <CorregirEjerciciosSubidos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
