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
import "./styles/HomeEspacio.css";
import "./styles/Apuntes.css";
import "./styles/TarjetaProfesor.css";
import "./styles/TodosProfesores.css";
import "./styles/NotFound.css";
import "./styles/TarjetaApunte.css";
import "./styles/Toast.css";
import "./styles/ConfirmModal.css";

import Toast from "./components/common/Toast.jsx";
import ConfirmModal from "./components/common/ConfirmModal.jsx";

function App() {
  return <>
    <Analytics />
    <Toast />
    <ConfirmModal />
    <AppRouter />
  </>;
}

export default App;
