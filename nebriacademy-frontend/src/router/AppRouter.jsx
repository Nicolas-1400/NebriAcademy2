import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos todas las páginas de la aplicación
import Login from "../pages/auth/Login.jsx";
import NotFound from "../pages/common/NotFound.jsx";
import Home from "../pages/catalogs/Home.jsx";
import MySpace from "../pages/catalogs/MySpace.jsx";
import AllCourses from "../pages/catalogs/Courses/AllCourses.jsx";
import CourseDetail from "../pages/catalogs/Courses/CourseDetail.jsx";
import AddCourse from "../pages/management/AddCourse.jsx";
import AddContent from "../pages/management/AddContent.jsx";
import EditContent from "../pages/management/EditContent.jsx";
import GradeExercises from "../pages/management/GradeExercises.jsx";
import AllProfessors from "../pages/catalogs/Professors/AllProfessors.jsx";
import ProfessorInfo from "../pages/catalogs/Professors/ProfessorInfo.jsx";
import AllNotes from "../pages/catalogs/AllNotes.jsx";
import PreRegister from "../pages/auth/PreRegister.jsx";
import Verification from "../pages/auth/AccountVerification.jsx";
import Register from "../pages/auth/Register.jsx";
import Profile from "../pages/account/Profile.jsx";
import Help from "../pages/support/Help.jsx";
import MyTickets from "../pages/support/MyTickets.jsx";
import TicketDetail from "../pages/support/TicketDetail.jsx";
import Accounts from "../pages/account/Accounts.jsx";
import Policies from "../pages/support/Policies.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas: accesibles sin estar logueado */}
        <Route path="/" element={<Login />} />
        <Route path="/PreRegister" element={<PreRegister />} />

        {/* Flujo de registro genérico según tipo de usuario */}
        <Route path="/Register/:tipo" element={<Register />} />
        <Route path="/Register/Verification/:tipo" element={<Verification />} />

        {/* Ruta no encontrada: si ninguna ruta coincide, mostramos la página 404 */}
        <Route path="*" element={<NotFound />} />

        {/* Rutas privadas: requieren usuario logueado (ProtectedRoute lo comprueba) */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MySpace"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <MySpace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MyTickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/MyTickets/:issueKey"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Courses"
          element={
            <ProtectedRoute requiredTipo={["alumno", "administrador"]}>
              <AllCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/AddContent/:tipo/:id?"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <AddContent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Professors"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <AllProfessors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Professors/:id"
          element={
            <ProtectedRoute requiredTipo="alumno">
              <ProfessorInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Home/Accounts"
          element={
            <ProtectedRoute requiredTipo="administrador">
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Notes"
          element={
            <ProtectedRoute>
              <AllNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Notes/EditContent/:id"
          element={
            <ProtectedRoute requiredTipo={["alumno", "profesor"]}>
              <EditContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Policies/:tipo"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />

        {/* Rutas exclusivas de profesor: requieren además que el tipo de usuario sea "profesor" */}
        <Route
          path="/Home/AddCourse"
          element={
            <ProtectedRoute requiredTipo="profesor">
              <AddCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Courses/:id/EditContent"
          element={
            <ProtectedRoute requiredTipo="profesor">
              <EditContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/Courses/:courseId/GradeExercises/:exerciseId"
          element={
            <ProtectedRoute requiredTipo={["profesor", "administrador"]}>
              <GradeExercises />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
