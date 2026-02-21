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
import VerificacionAlumnoNebrija from "../pages/VerificacionAlumnoNebrija.jsx";
import VerificacionProfesor from "../pages/VerificacionProfesor.jsx";
import RegisterAlumnoNebrija from "../pages/RegisterAlumnoNebrija.jsx";
import RegisterAlumnoExterno from "../pages/RegisterAlumnoExterno.jsx";
import RegisterProfesor from "../pages/RegisterProfesor.jsx";
import Perfil from "../pages/Perfil.jsx";

// Importamos los guardas de ruta que protegen el acceso según el estado de sesión
import ProtectedRoute from "./ProtectedRoute";
import ProtectedVerificationRoute from "./ProtectedVerificationRoute.jsx";
import ProtectedVerificationProfesorRoute from "./ProtectedVerificationProfesorRoute.jsx";
import PoliticaDePrivacidad from "../pages/PoliticaDePrivacidad.jsx";
import NotaLegal from "../pages/NotaLegal.jsx";
import PoliticaDeCookies from "../pages/PoliticaDeCookies.jsx";

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
          path="/Register/VerificacionAlumnoNebrija"
          element={<VerificacionAlumnoNebrija />}
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

        {/* Flujo de registro para profesores: verificación → formulario de registro */}
        <Route
          path="/Register/VerificacionProfesor"
          element={<VerificacionProfesor />}
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

        {/* Ruta comodín: si ninguna ruta coincide, mostramos la página 404 */}
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
            <ProtectedRoute>
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
          path="/Home/Cursos"
          element={
            <ProtectedRoute>
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
            <ProtectedRoute>
              <AddContenidoCurso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Profesores"
          element={
            <ProtectedRoute>
              <TodosProfesores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Profesores/:id"
          element={
            <ProtectedRoute>
              <InfoProfesor />
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
            <ProtectedRoute>
              <AddApunteIndividual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Apuntes/EditarApunte/:id"
          element={
            <ProtectedRoute>
              <EditarApunteIndividual />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/PoliticaDePrivacidad"
          element={
            <ProtectedRoute>
              <PoliticaDePrivacidad />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/NotaLegal"
          element={
            <ProtectedRoute>
              <NotaLegal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/PoliticaDeCookies"
          element={
            <ProtectedRoute>
              <PoliticaDeCookies />
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
            <ProtectedRoute requiredTipo="profesor">
              <CorregirEjerciciosSubidos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
