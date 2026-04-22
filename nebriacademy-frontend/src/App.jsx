import AppRouter from "./router/AppRouter.jsx";
import { Analytics } from "@vercel/analytics/react";

import "./styles/general.css";
import "./styles/Header.css";
import "./styles/Nav.css";
import "./styles/AddCurso.css";
import "./styles/Footer.css";
import "./styles/Login.css";
import "./styles/RegisterExterno.css";
import "./styles/Perfil.css";
import "./styles/TodosCursos.css";
import "./styles/Politicas.css";
import "./styles/Curso.css";
import "./styles/AddContenidoCurso.css";
import "./styles/Home.css";
import "./styles/Apuntes.css";
import "./styles/TarjetaCursoPequena.css";
import "./styles/TarjetaProfesor.css";
import "./styles/TodosProfesores.css";
import "./styles/MiEspacio.css";
import "./styles/NotFound.css";
import "./styles/TarjetaApunte.css";

function App() {
  return <>
    <Analytics />
    <AppRouter />
  </>;
}

export default App;
