const menuItemsConfig = [
  { 
    icon: "folder_open", 
    label: "Proyectos", 
    route: "/projects",
    requiresAdmin: false 
  },
  { 
    icon: "add_circle", 
    label: "Nuevo proyecto", 
    route: "/projects/nuevo",
    requiresAdmin: true 
  },
  { 
    icon: "group", 
    label: "Usuarios", 
    route: "/users",
    requiresAdmin: true 
  },
  { 
    icon: "person_add", 
    label: "Añadir usuario", 
    route: "/registerform",
    requiresAdmin: true
  },
  { 
    icon: "person", 
    label: "Roles", 
    route: "/roles",
    requiresAdmin: true
  }
];

export default menuItemsConfig;



  