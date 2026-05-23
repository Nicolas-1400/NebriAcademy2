// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { create } from "zustand";

// ── STORE ──────────────────────────────────────────────────────────────────────
// Store global para gestionar notificaciones flotantes (toasts).
// Cada toast tiene un ID único basado en Date.now() para poder eliminarlo individualmente.
const useToastStore = create((set) => ({
  toasts: [],

  // Añade un toast al array y lo elimina automáticamente tras `duration` ms
  addToast: (message, type = "info", duration = 10000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Autoeliminación: buscamos el toast por su id y lo quitamos del array
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  // Elimina manualmente un toast (por ejemplo, al pulsar el botón de cierre)
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export default useToastStore;
