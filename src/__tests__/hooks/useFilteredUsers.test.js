import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useFilteredUsers from '../../hooks/useFilteredUsers';

describe('useFilteredUsers', () => {
  test('should filter users based on search term', () => {
    const { result } = renderHook(() => useFilteredUsers('alpha', 'asc'));

    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].name).toBe('Usuario Alpha');
  });

  test('should sort users by createdAt in ascending order', () => {
    const { result } = renderHook(() => useFilteredUsers('', 'asc'));

    const users = result.current.filteredUsers.map((user) => user.name);
    expect(users).toEqual(['Usuario Alpha', 'Usuario Beta', 'Usuario Gamma']);
  });

  test('should sort users by createdAt in descending order', () => {
    const { result } = renderHook(() => useFilteredUsers('', 'desc'));

    const users = result.current.filteredUsers.map((user) => user.name);
    expect(users).toEqual(['Usuario Gamma', 'Usuario Beta', 'Usuario Alpha']);
  });

  test('should update user role', () => {
    const { result } = renderHook(() => useFilteredUsers('', 'asc'));

    act(() => {
      result.current.updateUserRole(1, 'Admin');
    });

    const updatedUser = result.current.filteredUsers.find((user) => user.id === 1);
    expect(updatedUser.role).toBe('Admin');
  });

  test('should delete a user', () => {
    const { result } = renderHook(() => useFilteredUsers('', 'asc'));

    act(() => {
      result.current.deleteUser(2);
    });

    const users = result.current.filteredUsers.map((user) => user.id);
    expect(users).not.toContain(2);
    expect(users).toHaveLength(2);
  });
});
