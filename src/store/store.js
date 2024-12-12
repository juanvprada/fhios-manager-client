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
      ...initialState,

      login: ({ user, token, roles }) => {
        const formattedRoles = (roles || []).map(role => ({
          role_name: role.role_name || role,
          role_id: role.role_id || null
        }));

        set({
          user,
          token,
          isAuthenticated: true,
          userRoles: formattedRoles
        });
      },

      logout: () => {
        set(initialState);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        userRoles: state.userRoles
      })
    }
  )
);

export default useStore;