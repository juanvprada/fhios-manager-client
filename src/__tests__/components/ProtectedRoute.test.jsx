import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import useStore from '../../store/store';

jest.mock('../../store/store', () => ({
  getState: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockGetState = useStore.getState;

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={ui}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children if authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: true, role: 'user' });

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { route: '/' }
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders children if authenticated and adminOnly is true for admin', () => {
    mockGetState.mockReturnValue({ isAuthenticated: true, role: 'admin' });

    const { getByText } = renderWithRouter(
      <ProtectedRoute adminOnly={true}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      { route: '/admin' }
    );

    expect(getByText('Admin Content')).toBeInTheDocument();
  });

  test('renders Outlet if no children are provided and authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: true, role: 'user' });

    const { getByText } = renderWithRouter(<ProtectedRoute />, { route: '/dashboard' });

    expect(getByText('Dashboard')).toBeInTheDocument();
  });
});
