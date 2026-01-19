import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login.jsx"
import Home from "../pages/Home.jsx"
import PreRegister from "../pages/PreRegister.jsx"
import Register from "../pages/Register.jsx"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />
        <Route path="/PreRegister/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter