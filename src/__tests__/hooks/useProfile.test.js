import { renderHook, act } from '@testing-library/react';
import useProfile from '../../hooks/useProfile';
import useStore from '../../store/store';

jest.mock('../../services/usersServices');
jest.mock('../../store/store');

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock del estado del store con un user_id válido
    useStore.mockReturnValue({
      user: { user_id: 1 },
    });
  });

  test('should set error if any field is empty', () => {
    const { result } = renderHook(() => useProfile());

    act(() => {
      result.current.setCurrentPassword('');
      result.current.setNewPassword('');
      result.current.setConfirmPassword('');
    });

    act(() => {
      result.current.handlePasswordUpdate({ preventDefault: jest.fn() });
    });

    // Verificamos que se establece un mensaje de error si los campos están vacíos
    expect(result.current.error).toBe('Por favor, completa todos los campos.');
  });
});
