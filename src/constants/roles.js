export const ROLES = {
    ADMIN: 'Administrador',
    PROJECT_MANAGER: 'Project Manager',
    DEVELOPER: 'Developer',
    DESIGNER: 'Designer',
    TEAM_LEADER: 'Team Leader',
    QA_ANALYST: 'QA Analyst'
  };
  
  export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: {
      canManageUsers: true,
      canManageRoles: true,
      canManageProjects: true,
      canAccessDashboard: true,
      canCreateProjects: true,
      canViewProjects: true,
    },
    [ROLES.PROJECT_MANAGER]: {
      canManageProjects: true,
      canAccessDashboard: true,
      canCreateProjects: true,
      canViewProjects: true,
      canManageTeam: true,
    },
    [ROLES.TEAM_LEADER]: {
      canAccessDashboard: true,
      canViewProjects: true,
      canManageTeam: true,
    },
    [ROLES.DEVELOPER]: {
      canAccessDashboard: true,
      canViewProjects: true,
    },
    [ROLES.DESIGNER]: {
      canAccessDashboard: true,
      canViewProjects: true,
    },
    [ROLES.QA_ANALYST]: {
      canAccessDashboard: true,
      canViewProjects: true,
    }
  };