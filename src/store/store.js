import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userRoles: []
};

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null, // Añadimos el rol al estado

      login: (userData, token, role = 'admin') => {
        const user = {
          ...userData,
          user_id: userData.user_id || userData.id, // Aseguramos que `user_id` esté presente
        };

        set({
          user,
          token,
          isAuthenticated: true,
          role,
        });
      },

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        role: null,
      }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData, user_id: userData.user_id || userData.id },
        })),

      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
