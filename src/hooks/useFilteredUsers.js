// hooks/useFilteredUsers.js
import { useMemo, useState } from "react";

// Mock data inicial
const initialUsers = [
  { 
    id: 1, 
    name: "Usuario Alpha", 
    email: "alpha@email.com",
    role: "User",
    createdAt: new Date("2023-01-15") 
  },
  { 
    id: 2, 
    name: "Usuario Beta", 
    email: "beta@email.com",
    role: "Project Manager",
    createdAt: new Date("2023-05-10") 
  },
  { 
    id: 3, 
    name: "Usuario Gamma", 
    email: "gamma@email.com",
    role: "Tech Leader",
    createdAt: new Date("2023-09-12") 
  },
];

const useFilteredUsers = (searchTerm, sortOrder) => {
  const [users, setUsers] = useState(initialUsers);

  const updateUserRole = (userId, newRole) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.createdAt - b.createdAt;
        } else {
          return b.createdAt - a.createdAt;
        }
      });
  }, [users, searchTerm, sortOrder]);

  return { filteredUsers, updateUserRole, deleteUser };
};

export default useFilteredUsers;