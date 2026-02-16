// Importar dependencias de React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importar componentes de páginas
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
import RegisterAlumnoNebrija from "../pages/RegisterAlumnoNebrija.jsx";
import RegisterAlumnoExterno from "../pages/RegisterAlumnoExterno.jsx";
import RegisterProfesor from "../pages/RegisterProfesor.jsx";
import Perfil from "../pages/Perfil.jsx";
import ProtectedRoute from "./ProtectedRoute";
import PoliticaDePrivacidad from "../pages/PoliticaDePrivacidad.jsx";
import NotaLegal from "../pages/NotaLegal.jsx";
import PoliticaDeCookies from "../pages/PoliticaDeCookies.jsx";

/**
 * Componente: AppRouter
 * Gestor central de navegación. Define las rutas públicas y protegidas.
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================================================
            RUTAS PÚBLICAS
            Cualquiera puede entrar aquí (Login, Registro...).
           ======================================================= */}
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />
        <Route
          path="/Register/VerificacionAlumnoNebrija"
          element={<VerificacionAlumnoNebrija />}
        />
        <Route
          path="/Register/RegisterAlumnoNebrija"
          element={<RegisterAlumnoNebrija />}
        />
        <Route
          path="/Register/RegisterAlumnoExterno"
          element={<RegisterAlumnoExterno />}
        />
        <Route
          path="/Register/RegisterProfesor"
          element={<RegisterProfesor />}
        />

        {/* Ruta para cuando no se encuentra la página (Error 404) */}
        <Route path="*" element={<NotFound />} />

        {/* =======================================================
            RUTAS PROTEGIDAS
            Necesitas haber iniciado sesión para ver estas páginas.
            Usamos 'ProtectedRoute' para bloquear el acceso si no hay usuario.
           ======================================================= */}

        {/* --- Home y Perfil --- */}
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

        {/* --- Cursos --- */}
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

        {/* --- Profesores --- */}
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

        {/* --- Apuntes --- */}
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

        {/* --- Páginas Legales --- */}
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

        {/* =======================================================
            RUTAS EXCLUSIVAS DE PROFESORES
           ======================================================= */}
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

        {/* Rutas de registro específicas que requieren auth previa (ej: completar registro tras verificación) */}
        <Route
          path="/RegisterAlumnoNebrija"
          element={
            <ProtectedRoute>
              <RegisterAlumnoNebrija />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
