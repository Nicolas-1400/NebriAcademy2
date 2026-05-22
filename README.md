# NebriAcademy

Plataforma educativa online desarrollada como Trabajo de Fin de Grado. Permite a alumnos acceder a cursos, vídeos, apuntes y ejercicios; a profesores gestionar y calificar contenido; y a administradores supervisar cuentas y atender soporte.

---

## Tecnologías

**Frontend**
- React 19 + Vite
- React Router DOM v7
- Zustand (gestión de estado y sesión)
- React Slick (sliders)
- Vercel Analytics
- CSS modular por componente

**Backend**
- Node.js + Express 5
- Sequelize ORM + MySQL 2
- Cloudinary (almacenamiento de archivos: apuntes, vídeos, ejercicios)
- Multer (subida de archivos)
- Jira Atlassian API (sistema de tickets de soporte)
- dotenv, cors, axios

**Base de datos**
- MySQL alojada en Aiven (cloud)

---

## Estructura del proyecto

```
/
├── nebriacademy-frontend/   # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables (common, layout, management, support)
│   │   ├── pages/           # Vistas por sección (auth, catalogs, management, support, account)
│   │   ├── router/          # AppRouter + ProtectedRoute
│   │   ├── store/           # Zustand stores (auth, modales, toasts)
│   │   ├── config/          # URL base de la API
│   │   └── styles/          # CSS globales
│
├── nebriacademy-backend/    # API REST en Express
│   └── src/
│       ├── models/          # Modelos Sequelize
│       ├── routes/          # Rutas por entidad
│       └── database/        # Conexión y lógica de login
│
└── Documents/               # Diagramas, SQL, memoria y diseño Figma
```

---

## Roles de usuario

- **Alumno** — acceso a cursos, apuntes, vídeos, ejercicios, perfil y soporte
- **Profesor** — gestión de cursos, subida y edición de contenido, calificación de ejercicios
- **Administrador** — gestión de cuentas y administración de tickets de soporte

Las rutas están protegidas según rol mediante `ProtectedRoute`.

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
| `CLOUDINARY_*` | backend `.env` | Credenciales de Cloudinary |
| `JIRA_*` | backend `.env` | Integración con Jira para tickets |
| `VITE_API_URL` | frontend `.env` | URL del backend en producción |

> ⚠️ El archivo `.env` nunca debe subirse al repositorio. Está excluido en `.gitignore`.

---

## Despliegue

- **Frontend**: desplegado en [Vercel](https://vercel.com) — el archivo `vercel.json` gestiona el enrutamiento SPA.
- **Backend**: configurable en cualquier plataforma Node.js (Railway, Render, etc.).
- **Base de datos**: MySQL en la nube mediante [Aiven](https://aiven.io).
- **Archivos**: almacenados en [Cloudinary](https://cloudinary.com).

---

## Documentación

Dentro de la carpeta `Documents/` se incluye:

- Diagrama de clases (PlantUML + PNG/SVG)
- Diagrama de casos de uso y ER (Draw.io + PNG)
- Script SQL de la base de datos (`nebriacademy.sql`)
- Diseño de interfaces en Figma
- Memoria del proyecto
