import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const token = useStore.getState().token;
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async () => {
  try {
    const [usersResponse, rolesResponse] = await Promise.all([
      axios.get(`${API_URL}/users`, getHeaders()),
      axios.get(`${API_URL}/user_roles`, getHeaders()),
    ]);

    const formattedUsers = usersResponse.data.map((user) => {
      const userRole = rolesResponse.data.find(
        (role) => role.user_id === user.user_id
      );

      return {
        id: user.user_id,
        user_id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: userRole?.role_name || 'Sin rol',
        created_at: user.created_at,
        status: user.status,
      };
    });

    console.log('Formatted Users with Roles:', formattedUsers);
    return formattedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAllUserRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/user_roles`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Error in getUserRoles service:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, roleName) => {
  try {
    const rolesResponse = await axios.get(`${API_URL}/roles`, getHeaders());
    const role = rolesResponse.data.find((r) => r.role_name === roleName);

    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    const response = await axios.post(
      `${API_URL}/user_roles`,
      {
        user_id: userId,
        role_id: role.role_id,
      },
      getHeaders()
    );

    return {
      ...response.data,
      role: roleName,
    };
  } catch (error) {
    console.error('Error in updateUserRole service:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, getHeaders());
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/change-password`,
      {
        currentPassword,
        newPassword,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const assignUserRole = async (userId, roleId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user_roles`,
      { user_id: userId, role_id: roleId },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning user role:', error);
    throw error;
  }
};

export const removeUserRole = async (userId, roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/user_roles`, {
      data: { user_id: userId, role_id: roleId },
      ...getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error removing user role:', error);
    throw error;
  }
};
