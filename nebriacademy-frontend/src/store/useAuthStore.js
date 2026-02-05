import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tipo: null,
      setUser: (userObj, tipo) => set({ user: userObj, tipo: tipo || userObj?.tipo || null }),
      logout: () => set({ user: null, tipo: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, tipo: state.tipo }),
    }
  )
)

export default useAuthStore
