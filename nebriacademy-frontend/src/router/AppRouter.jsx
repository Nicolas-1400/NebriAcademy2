import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login.jsx"
import Home from "../pages/Home.jsx"
import MiEspacio from "../pages/MiEspacio.jsx"
import TodosCursos from "../pages/TodosCursos.jsx"
import Profesores from "../pages/Profesores.jsx"
import Apuntes from "../pages/Apuntes.jsx"
import PreRegister from "../pages/PreRegister.jsx"
import VerificacionAlumnoNebrija from "../pages/VerificacionAlumnoNebrija.jsx"
import RegisterAlumnoNebrija from "../pages/RegisterAlumnoNebrija.jsx"
import RegisterAlumnoExterno from "../pages/RegisterAlumnoExterno.jsx"
import RegisterProfesor from "../pages/RegisterProfesor.jsx"
import Perfil from "../pages/Perfil.jsx"
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
        <Route path="/RegisterAlumnoNebrija" element={<RegisterAlumnoNebrija />} />
        <Route path="/Register/RegisterAlumnoExterno" element={<RegisterAlumnoExterno />} />
        <Route path="/Register/RegisterProfesor" element={<RegisterProfesor />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Home/MiEspacio" element={<MiEspacio/>} />
        <Route path="/Home/Cursos" element={<TodosCursos />} />
        <Route path="/Home/Profesores" element={<Profesores />} />
        <Route path="/Home/Apuntes" element={<Apuntes />} />
        <Route path="/Home/Perfil" element={<Perfil />} />
        <Route path="/Home/PoliticaDePrivacidad" element={<PoliticaDePrivacidad />} />
        <Route path="/Home/NotaLegal" element={<NotaLegal />} />
        <Route path="/Home/PoliticaDeCookies" element={<PoliticaDeCookies />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter