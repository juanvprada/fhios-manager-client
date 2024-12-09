import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null, // Añadimos el rol al estado

      login: (userData, token, role = 'admin') => set({ 
        user: userData, 
        token: token, 
        isAuthenticated: true,
        role: role 
      }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        role: null 
      }),

      updateUser: (userData) => set(state => ({ 
        user: { ...state.user, ...userData } 
      })),

      setRole: (role) => set({ role })
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage
    }
  )
);

export default useStore;