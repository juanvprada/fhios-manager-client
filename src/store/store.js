import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,

      // Acciones para actualizar el estado
      login: (userData, token) => set({ 
        user: userData, 
        token: token, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      // Método para actualizar usuario
      updateUser: (userData) => set(state => ({ 
        user: { ...state.user, ...userData } 
      }))
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      getStorage: () => localStorage
    }
  )
);

export default useStore;