// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { create } from "zustand";

// ── STORE ──────────────────────────────────────────────────────────────────────
// Store global para manejar un modal de confirmación reutilizable.
// El patrón usado convierte el modal en una Promise: el caller hace await showConfirm(...)
// y recibe true/false (o el texto del input) cuando el usuario pulsa Confirmar/Cancelar.
const useModalStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  withInput: false,
  inputValue: "",
  resolve: null,

  // Abre el modal y devuelve una Promise que se resuelve cuando el usuario actúa
  showConfirm: (message, title = "Confirmación", options = {}) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        // withInput: true muestra un textarea para que el usuario escriba una razón
        withInput: options.withInput || false,
        inputValue: "",
        resolve,
      });
    });
  },

  setInputValue: (val) => set({ inputValue: val }),

  // Resuelve la Promise con el valor del input (o true si no había input) y cierra el modal
  confirm: () => {
    const { resolve, inputValue } = useModalStore.getState();
    if (resolve) resolve(inputValue || true);
    set({ isOpen: false, resolve: null, withInput: false, inputValue: "" });
  },

  // Resuelve la Promise con false (cancelación) y cierra el modal
  cancel: () => {
    const { resolve } = useModalStore.getState();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null, withInput: false, inputValue: "" });
  },
}));

export default useModalStore;
