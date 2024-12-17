import useStore from '../../store/store';

describe('useStore Zustand', () => {
  afterEach(() => {
    // Resetear el estado después de cada prueba
    useStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  });

  test('debería tener un estado inicial correcto', () => {
    const state = useStore.getState();
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBe(null);
  });

  test('login debería actualizar el estado con usuario, token y autenticación', () => {
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const token = 'mockToken';
    const role = 'admin';

    useStore.getState().login(userData, token, role);

    const state = useStore.getState();
    expect(state.user).toEqual({ ...userData, user_id: 1 });
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe(role);
  });

  test('logout debería resetear el estado', () => {
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const token = 'mockToken';
    const role = 'admin';

    useStore.getState().login(userData, token, role);
    useStore.getState().logout();

    const state = useStore.getState();
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBe(null);
  });

  test('setRole debería actualizar el rol del usuario', () => {
    useStore.getState().setRole('Project Manager');

    const state = useStore.getState();
    expect(state.role).toBe('Project Manager');
  });

  test('persistencia debería funcionar correctamente con localStorage', () => {
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const token = 'mockToken';

    // Simular persistencia en localStorage
    useStore.getState().login(userData, token, 'admin');
    const persistedState = JSON.parse(localStorage.getItem('auth-storage'));

    expect(persistedState).toMatchObject({
      state: {
        user: { ...userData, user_id: 1 },
        token: token,
        isAuthenticated: true,
        role: 'admin',
      },
    });
  });
});
