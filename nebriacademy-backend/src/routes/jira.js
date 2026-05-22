// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const controller = require("../controllers/jiraController.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta temporal para guardar los archivos antes de enviarlos a Jira
const uploadDir = path.join(__dirname, "..", "temp_uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + "-" + path.basename(file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ── CONFIGURACIÓN DE JIRA ───────────────────────────────────────────────────
const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

// ── POST /incidencias ───────────────────────────────────────────────────────
// Crea un nuevo ticket en Jira y le adjunta archivos si los hay
router.post("/", upload.single("archivo"), controller.create);

// ── GET /incidencias/mis-tickets/:usuarioId ──────────────────────────────────
// Devuelve todos los tickets del usuario, buscándolos por el label uid-{id}
router.get("/mis-tickets/:usuarioId", controller.misTickets);

// ── GET /incidencias/ticket/:issueKey ────────────────────────────────────────
// Devuelve el detalle completo de un ticket y sus comentarios
router.get("/ticket/:issueKey", controller.ticketDetail);

// ── POST /incidencias/ticket/:issueKey/comentario ────────────────────────────
// Añade un comentario del usuario al ticket
router.post("/ticket/:issueKey/comentario", controller.addComment);

// ── POST /incidencias/ticket/:issueKey/adjunto ───────────────────────────────
// Sube uno o más archivos a un ticket existente en Jira
router.post("/ticket/:issueKey/adjunto", upload.array("archivos", 5), controller.addAttachments);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
