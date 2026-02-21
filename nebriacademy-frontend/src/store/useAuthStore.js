import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store de Autenticación
const useAuthStore = create(
  persist(
    (set) => ({
      // Estado Inicial
      user: null,
      tipo: null,

      // Acciones
      setUser: (userObj, tipo) =>
        set({
          user: userObj,
          tipo: tipo || userObj?.tipo || null,
        }),

      logout: () => set({ user: null, tipo: null }),
    }),
    {
      // Persistencia
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, tipo: state.tipo }),
    },
  ),
);

export default useAuthStore;