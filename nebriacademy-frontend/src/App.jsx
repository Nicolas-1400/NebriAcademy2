// ==========================================
// 1. IMPORTACIONES
// ==========================================
import AppRouter from "./router/AppRouter.jsx";

// Hojas de Estilos CSS Globales y Modulares
import "./styles/general.css";
import "./styles/Header.css";
import "./styles/Nav.css";
import "./styles/NavProfesor.css";
import "./styles/AddCurso.css";
import "./styles/Footer.css";
import "./styles/Login.css";
import "./styles/RegisterExterno.css";
import "./styles/Perfil.css";
import "./styles/TodosCursos.css";
import "./styles/Politicas.css";
import "./styles/Curso.css";
import "./styles/AddContenidoCurso.css";
import "./styles/HomeFeed.css";
import "./styles/Apuntes.css";
import "./styles/TarjetaCursoPequena.css";
import "./styles/TarjetaProfesor.css";
import "./styles/TodosProfesores.css";
import "./styles/MiEspacio.css";
import "./styles/HomeProfesor.css";
import "./styles/NotFound.css";
import "./styles/TarjetaApunte.css";

// ==========================================
// 2. COMPONENTE PRINCIPAL (RAÍZ)
// ==========================================
function App() {
  return <AppRouter />;
}

// ==========================================
// 3. EXPORTACIONES
// ==========================================
export default App;
