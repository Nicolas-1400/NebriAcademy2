// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// 2. EXPORTACIÓN DEL ESTADO GLOBAL
// ==========================================
// Configuración de la tienda de Zustand para Auth. Utiliza persistencia para sobrellevar F5 (refrescos).
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
