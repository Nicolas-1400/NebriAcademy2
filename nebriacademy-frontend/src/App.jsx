import AppRouter from "./router/AppRouter.jsx";
import { Analytics } from "@vercel/analytics/react";

// Importación global de estilos (CSS centralizado y módulos específicos)
import "./styles/general.css";
import "./components/layout/Header/Header.css";
import "./components/layout/Nav/Nav.css";
import "./components/common/SearchSidebar/SearchSidebar.css";
import "./components/support/HelpGrid/HelpGrid.css";
import "./components/support/MyTicketsGrid/MyTicketsGrid.css";
import "./components/support/PoliciesGrid/PoliciesGrid.css";
import "./components/support/TicketDetailGrid/TicketDetailGrid.css";
import "./components/layout/Footer/Footer.css";
import "./components/auth/LoginGrid/LoginGrid.css";
import "./components/auth/RegisterGrid/RegisterGrid.css";
import "./components/auth/PreRegisterGrid/PreRegisterGrid.css";
import "./components/auth/AccountVerificationGrid/AccountVerificationGrid.css";
import "./components/catalogs/Home/Home.css";
import "./components/catalogs/MySpaceGrid/MySpaceGrid.css";
import "./components/catalogs/Courses/AllCoursesGrid/AllCoursesGrid.css";
import "./components/catalogs/Courses/CourseCard/CourseCard.css";
import "./components/catalogs/Courses/CourseGrid/CourseGrid.css";
import "./components/catalogs/Courses/CourseBackgroundCard/CourseBackgroundCard.css";
import "./components/account/ProfileGrid/ProfileGrid.css";
import "./components/account/AccountsGrid/AccountsGrid.css";
import "./components/account/AccountsTable/AccountsTable.css";
import "./components/account/ProfileImageCard/ProfileImageCard.css";
import "./components/catalogs/Notes/AllNotesGrid/AllNotesGrid.css";
import "./components/catalogs/Notes/NoteCard/NoteCard.css";
import "./components/catalogs/Professors/AllProfessorsGrid/AllProfessorsGrid.css";
import "./components/catalogs/Professors/ProfessorCard/ProfessorCard.css";
import "./components/catalogs/Professors/ProfessorInfoGrid/ProfessorInfoGrid.css";
import "./components/common/Avatar/Avatar.css";
import "./components/common/Sliders/Sliders.css";
import "./components/management/AddCourseGrid/AddCourseGrid.css";
import "./components/management/GradeExercisesGrid/GradeExercisesGrid.css";
import "./components/management/StudentSubmissionCard/StudentSubmissionCard.css";
import "./components/common/NotFound/NotFound.css";
import "./components/common/Notifications/Toast.css";
import "./components/common/Modals/ConfirmModal.css";

// Componentes globales renderizados en toda la app
import Toast from "./components/common/Notifications/Toast.jsx";
import ConfirmModal from "./components/common/Modals/ConfirmModal.jsx";

// Componente raíz de la aplicación React
function App() {
  return (
    <>
      {/* Vercel Analytics para métricas de uso y rendimiento */}
      <Analytics />
      {/* Gestor global de notificaciones flotantes */}
      <Toast />
      {/* Gestor global de modales de confirmación (ej: borrar algo) */}
      <ConfirmModal />
      {/* Enrutador principal que gestiona la navegación entre páginas */}
      <AppRouter />
    </>
  );
}

export default App;
