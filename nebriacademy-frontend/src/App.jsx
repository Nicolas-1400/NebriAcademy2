import AppRouter from "./router/AppRouter.jsx";
import { Analytics } from "@vercel/analytics/react";

import "./styles/general.css";
import "./components/layout/Header/Header.css";
import "./components/layout/Nav/Nav.css";
import "./components/common/SearchSidebar/SearchSidebar.css";
import "./components/support/Support.css";
import "./components/layout/Footer/Footer.css";
import "./components/auth/Auth.css";
import "./components/catalogs/Home/Home.css";
import "./components/catalogs/Courses/Courses.css";
import "./components/account/Account.css";
import "./components/catalogs/Notes/Notes.css";
import "./components/catalogs/Professors/Professors.css";
import "./components/common/Avatar/Avatar.css";
import "./components/common/Sliders/Sliders.css";
import "./components/management/Management.css";
import "./components/common/NotFound/NotFound.css";
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
