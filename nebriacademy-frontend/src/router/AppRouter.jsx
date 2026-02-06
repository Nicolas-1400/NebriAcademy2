import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login.jsx"
import Home from "../pages/Home.jsx"
import MiEspacio from "../pages/MiEspacio.jsx"
import TodosCursos from "../pages/TodosCursos.jsx"
import Curso from "../pages/Curso.jsx"
import AddCurso from "../pages/AddCurso.jsx"
import AddContenidoCurso from "../pages/AddContenidoCurso.jsx"
import EditarContenidoCurso from "../pages/EditarContenidoCurso.jsx"
import TodosProfesores from "../pages/TodosProfesores.jsx"
import InfoProfesor from "../pages/InfoProfesor.jsx"
import Apuntes from "../pages/Apuntes.jsx"
import PreRegister from "../pages/PreRegister.jsx"
import VerificacionAlumnoNebrija from "../pages/VerificacionAlumnoNebrija.jsx"
import RegisterAlumnoNebrija from "../pages/RegisterAlumnoNebrija.jsx"
import RegisterAlumnoExterno from "../pages/RegisterAlumnoExterno.jsx"
import RegisterProfesor from "../pages/RegisterProfesor.jsx"
import Perfil from "../pages/Perfil.jsx"
import ProtectedRoute from './ProtectedRoute'
import PoliticaDePrivacidad from "../pages/PoliticaDePrivacidad.jsx"
import NotaLegal from "../pages/NotaLegal.jsx"
import PoliticaDeCookies from "../pages/PoliticaDeCookies.jsx"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />
        <Route path="/Register/VerificacionAlumnoNebrija" element={<VerificacionAlumnoNebrija />} />
        <Route path="/RegisterAlumnoNebrija" element={<ProtectedRoute><RegisterAlumnoNebrija /></ProtectedRoute>} />
        <Route path="/Register/RegisterAlumnoExterno" element={<RegisterAlumnoExterno />} />
        <Route path="/Register/RegisterProfesor" element={<RegisterProfesor />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Home/MiEspacio" element={<ProtectedRoute><MiEspacio/></ProtectedRoute>} />
        <Route path="/Home/Cursos" element={<ProtectedRoute><TodosCursos /></ProtectedRoute>} />
        <Route path="/Home/Cursos/:id" element={<ProtectedRoute><Curso /></ProtectedRoute>} />
        <Route path="/Home/Cursos/:id/AddContenidoCurso" element={<ProtectedRoute><AddContenidoCurso /></ProtectedRoute>} />
        <Route path="/Home/Cursos/:id/EditarContenidoCurso" element={<ProtectedRoute requiredTipo="profesor"><EditarContenidoCurso /></ProtectedRoute>} />
        <Route path="/Home/AddCurso" element={<ProtectedRoute requiredTipo="profesor"><AddCurso /></ProtectedRoute>} />
        <Route path="/Home/Profesores" element={<ProtectedRoute><TodosProfesores /></ProtectedRoute>} />
        <Route path="/Home/Profesores/:id" element={<ProtectedRoute><InfoProfesor /></ProtectedRoute>} />
        <Route path="/Home/Apuntes" element={<ProtectedRoute><Apuntes /></ProtectedRoute>} />
        <Route path="/Home/Perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/Home/PoliticaDePrivacidad" element={<ProtectedRoute><PoliticaDePrivacidad /></ProtectedRoute>} />
        <Route path="/Home/NotaLegal" element={<ProtectedRoute><NotaLegal /></ProtectedRoute>} />
        <Route path="/Home/PoliticaDeCookies" element={<ProtectedRoute><PoliticaDeCookies /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter