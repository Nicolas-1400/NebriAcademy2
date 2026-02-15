import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Store Global de Autenticación (Zustand)
 * Gestiona la sesión del usuario y su persistencia en el navegador.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // --- Estado Inicial ---
      user: null, // Objeto con datos del usuario (id, nombre, email...)
      tipo: null, // Rol del usuario: 'alumno', 'profesor', 'admin'

      // --- Acciones (Métodos para modificar el estado) ---

      /**
       * Inicia la sesión del usuario.
       * @param {Object} userObj - Datos del usuario
       * @param {string} tipo - Rol del usuario
       */
      setUser: (userObj, tipo) =>
        set({
          user: userObj,
          tipo: tipo || userObj?.tipo || null,
        }),

      /**
       * Cierra la sesión y limpia el estado.
       */
      logout: () => set({ user: null, tipo: null }),
    }),
    {
      // --- Configuración de Persistencia (LocalStorage) ---
      name: "auth-storage", // Nombre de la key en localStorage
      partialize: (state) => ({ user: state.user, tipo: state.tipo }), // Guardamos solo user y tipo
    },
  ),
);

export default useAuthStore;
