import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos todas las páginas de la aplicación
import Login from "../pages/auth/Login.jsx";
import NotFound from "../pages/common/NotFound.jsx";
import Home from "../pages/common/Home.jsx";
import MiEspacio from "../pages/MiEspacio.jsx";
import TodosCursos from "../pages/TodosCursos.jsx";
import Curso from "../pages/Curso.jsx";
import AddCurso from "../pages/AddCurso.jsx";
import AddContenido from "../pages/AddContenido.jsx";
import EditarContenido from "../pages/EditarContenido.jsx";
import CorregirEjerciciosSubidos from "../pages/CorregirEjerciciosSubidos.jsx";
import TodosProfesores from "../pages/TodosProfesores.jsx";
import InfoProfesor from "../pages/InfoProfesor.jsx";
import Apuntes from "../pages/Apuntes.jsx";
import PreRegister from "../pages/auth/PreRegister.jsx";
import Verification from "../pages/auth/AccountVerification.jsx";
import Register from "../pages/auth/Register.jsx";
import Perfil from "../pages/Perfil.jsx";
import Help from "../pages/support/Help.jsx";
import MyTickets from "../pages/support/MyTickets.jsx";
import TicketDetail from "../pages/support/TicketDetail.jsx";
import Cuentas from "../pages/Cuentas.jsx";
import Policies from "../pages/support/Policies.jsx";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas: accesibles sin estar logueado */}
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />

        {/* Flujo de registro genérico según tipo de usuario */}
        <Route path="/Register/:tipo" element={<Register />} />
        <Route path="/Register/Verification/:tipo" element={<Verification />} />

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
          path="/Home/Help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MyTickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MyTickets/:issueKey"
          element={
            <ProtectedRoute>
              <TicketDetail />
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
          path="/Home/AddContenido/:tipo/:id?"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <AddContenido />
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
          path="/Home/Apuntes/EditarApunte/:id"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <EditarContenido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Policies/:tipo"
          element={
            <ProtectedRoute>
              <Policies />
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
          path="/Home/Cursos/:id/EditarContenido"
          element={
            <ProtectedRoute requiredTipo="profesor">
              <EditarContenido />
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
