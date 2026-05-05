import AppRouter from "./router/AppRouter.jsx";
import { Analytics } from "@vercel/analytics/react";

import "./styles/General.css";
import "./components/layout/Header/Header.css";
import "./components/layout/Nav/Nav.css";
import "./components/layout/SearchSidebar/SearchSidebar.css";
import "./components/support/Support.css";
import "./components/layout/Footer/Footer.css";
import "./components/auth/Auth.css";
import "./styles/AddCurso.css";
import "./styles/Perfil.css";
import "./styles/TodosCursos.css";
import "./styles/Curso.css";
import "./styles/AddContenidoCurso.css";
import "./components/common/Home/Home.css";
import "./styles/Apuntes.css";
import "./styles/TarjetaProfesor.css";
import "./styles/TodosProfesores.css";
import "./components/common/NotFound/NotFound.css";
import "./styles/TarjetaApunte.css";
import "./components/common/Notifications/Toast.css";
import "./components/common/Modals/ConfirmModal.css";
import Toast from "./components/common/Notifications/Toast.jsx";
import ConfirmModal from "./components/common/Modals/ConfirmModal.jsx";

function App() {
  return (
    <>
      <Analytics />
      <Toast />
      <ConfirmModal />
      <AppRouter />
    </>
  );
}

export default App;
