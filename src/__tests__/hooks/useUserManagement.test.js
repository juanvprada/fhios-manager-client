import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import useUserManagement from '../../hooks/useUserManagement';
import useStore from '../../store/store';

jest.mock('axios');
jest.mock('../../store/store');

describe('useUserManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockReturnValue({ token: 'mockToken' });
  });

  test('should handle fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() => useUserManagement());

    await waitFor(() => expect(result.current.error).toBe('Error al cargar los datos'));
  });
});
