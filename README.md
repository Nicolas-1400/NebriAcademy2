# NebriAcademy

Plataforma educativa online desarrollada como Trabajo de Fin de Grado. Permite a alumnos acceder a cursos, vídeos, apuntes y ejercicios; a profesores gestionar y calificar contenido; y a administradores supervisar cuentas y atender soporte mediante tickets de Jira.

---

## Tecnologías

**Frontend**
- React 19 + Vite 7
- React Router DOM v7
- Zustand v5 (gestión de estado y sesión, persistida en `localStorage`)
- React Slick + Slick Carousel (sliders)
- Vercel Analytics
- CSS modular por componente

**Backend**
- Node.js + Express 5
- Sequelize ORM v6 + MySQL 2
- Cloudinary v2 (almacenamiento de archivos: apuntes, vídeos, ejercicios)
- Multer v2 (subida de archivos)
- Jira Atlassian API (sistema de tickets de soporte)
- axios, cors, dotenv, streamifier, form-data

**Base de datos**
- MySQL alojada en Aiven (cloud)

---

## Estructura del proyecto

```
/
├── nebriacademy-frontend/          # Aplicación React
│   └── src/
│       ├── components/             # Componentes reutilizables por dominio
│       │   ├── account/            # AccountsGrid, AccountsTable, ProfileGrid, ProfileImageCard
│       │   ├── auth/               # LoginGrid, RegisterGrid, PreRegisterGrid, AccountVerificationGrid
│       │   ├── catalogs/           # Home, Courses, Notes, Professors, MySpaceGrid
│       │   ├── common/             # Avatar, Modals, NotFound, Notifications, ScrollToTop
│       │   ├── management/         # AddCourseGrid, AddContentGrid, EditContentGrid, GradeExercisesGrid
│       │   └── support/            # HelpGrid, MyTicketsGrid, TicketDetailGrid, PoliciesGrid
│       ├── pages/                  # Vistas enrutadas (una por pantalla)
│       │   ├── auth/               # Login, PreRegister, Register, AccountVerification
│       │   ├── catalogs/           # Home, MySpace, AllCourses, CourseDetail, AllNotes, AllProfessors, ProfessorInfo
│       │   ├── management/         # AddCourse, AddContent, EditContent, GradeExercises
│       │   ├── support/            # Help, MyTickets, TicketDetail, Policies
│       │   ├── account/            # Profile, Accounts
│       │   └── common/             # NotFound
│       ├── router/                 # AppRouter + ProtectedRoute
│       ├── store/                  # Zustand stores (useAuthStore, modalStore, toastStore)
│       ├── config/                 # URL base de la API (api.js)
│       └── assets/                 # Imágenes, iconos y fondos
│
├── nebriacademy-backend/           # API REST en Express
│   └── src/
│       ├── controllers/            # Lógica de negocio por entidad
│       ├── models/                 # Modelos Sequelize (Alumnos, Profesores, Cursos, Apuntes, Ejercicios, Vídeos, Notificaciones…)
│       ├── routes/                 # Rutas por entidad (montadas en app.js)
│       ├── database/               # Conexión Sequelize y lógica de login
│       └── utils/                  # cloudinaryHelper.js
│
└── Documents/                      # Diagramas, SQL, memoria y diseño
    ├── Modulado_de_datos/
    │   ├── diagrama-de-clases.puml
    │   ├── DiagramaCasosDeUsosNebriAcademy.drawio / .png
    │   ├── Diagrama_ER_NebriAcademy.drawio / .png
    │   └── nebriacademy.sql
    └── Otros/
        ├── Figma_NebriAcademy.png
        └── Memoria del Proyecto - NebriAcademy.docx
```

---

## Rutas del frontend

| Ruta | Acceso | Vista |
|---|---|---|
| `/` | Pública | Login |
| `/PreRegister` | Pública | Selección de tipo de cuenta |
| `/Register/:tipo` | Pública | Registro (alumno / profesor) |
| `/Register/Verification/:tipo` | Pública | Verificación de cuenta |
| `/Home` | Todos | Inicio |
| `/Home/Profile` | Todos | Perfil de usuario |
| `/Home/Notes` | Todos | Catálogo de apuntes |
| `/Home/Notes/EditContent/:id` | Alumno, Profesor | Editar apunte propio |
| `/Home/Help` | Todos | Soporte / ayuda |
| `/Home/MyTickets` | Todos | Mis tickets de Jira |
| `/Home/MyTickets/:issueKey` | Todos | Detalle de ticket |
| `/Home/Policies/:tipo` | Todos | Políticas de la plataforma |
| `/Home/MySpace` | Alumno | Mis cursos y progreso |
| `/Home/Professors` | Alumno | Catálogo de profesores |
| `/Home/Professors/:id` | Alumno | Ficha de profesor |
| `/Home/Courses` | Alumno, Administrador | Catálogo de cursos |
| `/Home/Courses/:id` | Todos | Detalle de curso |
| `/Home/AddContent/:tipo/:id?` | Alumno, Profesor | Añadir contenido |
| `/Home/Accounts` | Administrador | Gestión de cuentas |
| `/Home/AddCourse` | Profesor | Crear nuevo curso |
| `/Home/Courses/:id/EditContent` | Profesor | Editar contenido del curso |
| `/Home/Courses/:courseId/GradeExercises/:exerciseId` | Profesor | Calificar ejercicios |

---

## Roles de usuario

- **Alumno** — acceso a cursos, apuntes, vídeos, ejercicios, perfil, soporte y espacio personal (`MySpace`)
- **Profesor** — todo lo anterior más creación y edición de cursos y contenido, y calificación de ejercicios
- **Administrador** — gestión de cuentas de usuarios, acceso al catálogo de cursos y administración de tickets de soporte

Las rutas están protegidas según rol mediante `ProtectedRoute` (parámetro `requiredTipo`).

---

## Endpoints del backend

El servidor expone los siguientes prefijos de ruta en `http://localhost:3000`:

| Prefijo | Descripción |
|---|---|
| `/login` | Autenticación |
| `/usuarios` | Gestión de usuarios |
| `/alumnos` | Alumnos |
| `/profesores` | Profesores |
| `/administradores` | Administradores |
| `/cursos` | Cursos |
| `/cursosalumnos` | Matriculaciones |
| `/profesorescursos` | Relación profesor-curso |
| `/apuntes` | Apuntes |
| `/apuntesalumnos` | Apuntes por alumno |
| `/ejercicios` | Ejercicios |
| `/ejerciciosalumnos` | Entregas de ejercicios |
| `/puntuacionesejercicios` | Calificaciones |
| `/videos` | Vídeos |
| `/comentarioalumnocurso` | Comentarios de alumno en curso |
| `/notificaciones` | Notificaciones |
| `/jira` | Integración con Jira (tickets de soporte) |

---

## Instalación y ejecución local

### Requisitos previos
- Node.js ≥ 18
- pnpm

### Backend

```bash
cd nebriacademy-backend
```

Crea un archivo `.env` en esta carpeta con las siguientes variables:

```env
# Base de datos (MySQL / Aiven)
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Jira Atlassian
JIRA_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=
```

```bash
pnpm install
pnpm dev        # desarrollo (nodemon)
pnpm start      # producción
```

El servidor arranca en `http://localhost:3000`.

### Frontend

```bash
cd nebriacademy-frontend
pnpm install
pnpm dev
```

La aplicación arranca en `http://localhost:5173` y apunta al backend en `http://localhost:3000` por defecto. Para usar otra URL, define `VITE_API_URL` en un `.env` local.

---

## Variables de entorno

| Variable | Dónde | Descripción |
|---|---|---|
| `DB_HOST` … `DB_PASSWORD` | backend `.env` | Conexión a MySQL (Aiven) |
| `CLOUDINARY_CLOUD_NAME` | backend `.env` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | backend `.env` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | backend `.env` | API secret de Cloudinary |
| `JIRA_URL` | backend `.env` | URL del proyecto Jira |
| `JIRA_EMAIL` | backend `.env` | Email de la cuenta Jira |
| `JIRA_API_TOKEN` | backend `.env` | Token de API de Jira |
| `JIRA_PROJECT_KEY` | backend `.env` | Clave del proyecto Jira (p. ej. `KAN`) |
| `VITE_API_URL` | frontend `.env` | URL del backend en producción |

> ⚠️ El archivo `.env` nunca debe subirse al repositorio. Está excluido en `.gitignore`.

---

## Despliegue

- **Frontend**: desplegado en [Vercel](https://vercel.com) — el archivo `vercel.json` gestiona el enrutamiento SPA.
- **Backend**: configurable en cualquier plataforma Node.js (Railway, Render, etc.).
- **Base de datos**: MySQL en la nube mediante [Aiven](https://aiven.io).
- **Archivos**: almacenados en [Cloudinary](https://cloudinary.com).

---
