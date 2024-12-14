import menuItemsConfig from '../../components/menuItemsConfig';

describe('menuItemsConfig', () => {
  test('contains the correct number of menu items', () => {
    expect(menuItemsConfig).toHaveLength(5); // Verificar que hay 5 elementos en el menú
  });

  test('each menu item has the required properties', () => {
    menuItemsConfig.forEach((item) => {
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('route');
      expect(item).toHaveProperty('requiresAdmin');
    });
  });

  test('validates admin-only routes', () => {
    const adminOnlyRoutes = menuItemsConfig.filter((item) => item.requiresAdmin);

    // Verificar que los elementos requeridos son solo para administradores
    expect(adminOnlyRoutes).toEqual([
      { icon: 'add_circle', label: 'Nuevo proyecto', route: '/projects/nuevo', requiresAdmin: true },
      { icon: 'group', label: 'Usuarios', route: '/users', requiresAdmin: true },
      { icon: 'person_add', label: 'Añadir usuario', route: '/registerform', requiresAdmin: true },
      { icon: 'person', label: 'Roles', route: '/roles', requiresAdmin: true },
    ]);
  });

  test('validates non-admin routes', () => {
    const nonAdminRoutes = menuItemsConfig.filter((item) => !item.requiresAdmin);

    // Verificar que los elementos que no requieren administrador son correctos
    expect(nonAdminRoutes).toEqual([
      { icon: 'folder_open', label: 'Proyectos', route: '/projects', requiresAdmin: false },
    ]);
  });

  test('ensures all routes are unique', () => {
    const allRoutes = menuItemsConfig.map((item) => item.route);
    const uniqueRoutes = new Set(allRoutes);

    // Verificar que todas las rutas son únicas
    expect(allRoutes).toHaveLength(uniqueRoutes.size);
  });
});
