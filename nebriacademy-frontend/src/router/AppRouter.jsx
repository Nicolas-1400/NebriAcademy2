import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login.jsx"
import Home from "../pages/Home.jsx"
import PreRegister from "../pages/PreRegister.jsx"
import Register from "../pages/Register.jsx"
import PoliticaDePrivacidad from "../pages/PoliticaDePrivacidad.jsx"
import NotaLegal from "../pages/NotaLegal.jsx"
import PoliticaDeCookies from "../pages/PoliticaDeCookies.jsx"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />
        <Route path="/PreRegister/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Home/PoliticaDePrivacidad" element={<PoliticaDePrivacidad />} />
        <Route path="/Home/NotaLegal" element={<NotaLegal />} />
        <Route path="/Home/PoliticaDeCookies" element={<PoliticaDeCookies />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter