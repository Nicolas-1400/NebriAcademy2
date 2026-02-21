// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── STORE ──────────────────────────────────────────────────────────────────────
// Store global de autenticación usando Zustand.
// "persist" hace que el estado se guarde en localStorage para que sobreviva a recargas de página.
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tipo: null,

      // setUser: guarda el usuario y su tipo (alumno o profesor) al hacer login
      setUser: (userObj, tipo) =>
        set({
          user: userObj,
          tipo: tipo || userObj?.tipo || null,
        }),

      // logout: limpia el usuario y el tipo al cerrar sesión
      logout: () => set({ user: null, tipo: null }),
    }),
    {
      // Nombre de la clave en localStorage donde se persisten los datos
      name: "auth-storage",
      // Solo persistimos user y tipo, no funciones
      partialize: (state) => ({ user: state.user, tipo: state.tipo }),
    },
  ),
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
export default useAuthStore;
