// taskServices.jsx
import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = useStore.getState().token;
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const createTask = async (projectId, taskData) => {
    let processedTaskData = { 
        ...taskData,
        project_id: projectId
    };

    // Si hay múltiples usuarios asignados (viene como string separada por comas)
    if (taskData.assigned_to && taskData.assigned_to.includes(',')) {
        const userIds = taskData.assigned_to.split(',');
        processedTaskData = {
            ...processedTaskData,
            assigned_to: userIds[0],
            description: `${taskData.description || ''}\n<!--ASSIGNED_USERS:${userIds.join('|')}-->`
        };
    }

    const response = await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        processedTaskData,
        getAuthHeader()
    );

    // Procesamos la respuesta para incluir todos los usuarios asignados
    const assignedUsersMatch = response.data.description?.match(/<!--ASSIGNED_USERS:(.*?)-->/);
    const assignedUsers = assignedUsersMatch ? assignedUsersMatch[1].split('|') : [response.data.assigned_to];
    
    return {
        ...response.data,
        description: response.data.description?.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
        assignedUsers: assignedUsers
    };
};

export const getProjectTasks = async (projectId) => {
    const response = await axios.get(
        `${API_URL}/projects/${projectId}/tasks`,
        getAuthHeader()
    );

    // Procesamos cada tarea para extraer los usuarios asignados
    return response.data.map(task => {
        const assignedUsersMatch = task.description?.match(/<!--ASSIGNED_USERS:(.*?)-->/);
        const assignedUsers = assignedUsersMatch ? assignedUsersMatch[1].split('|') : [task.assigned_to];
        
        return {
            ...task,
            description: task.description?.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
            assignedUsers: assignedUsers.filter(Boolean)
        };
    });
};

export const getTaskById = async (taskId) => {
    const response = await axios.get(
        `${API_URL}/tasks/${taskId}`,
        getAuthHeader()
    );

    // Procesar la tarea para extraer los usuarios asignados
    const assignedUsersMatch = response.data.description?.match(/<!--ASSIGNED_USERS:(.*?)-->/);
    const assignedUsers = assignedUsersMatch ? 
        assignedUsersMatch[1].split('|') : 
        [response.data.assigned_to];

    return {
        ...response.data,
        description: response.data.description?.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
        assignedUsers: assignedUsers.filter(Boolean)
    };
};

export const updateTask = async (taskId, taskData) => {
    let processedTaskData = { ...taskData };

    // Si hay usuarios asignados en el formato nuevo
    if (taskData.assignedUsers) {
        processedTaskData = {
            ...taskData,
            assigned_to: taskData.assignedUsers[0],
            description: `${taskData.description || ''}\n<!--ASSIGNED_USERS:${taskData.assignedUsers.join('|')}-->`
        };
    }

    const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        processedTaskData,
        getAuthHeader()
    );

    // Procesamos la respuesta
    const assignedUsersMatch = response.data.description?.match(/<!--ASSIGNED_USERS:(.*?)-->/);
    const assignedUsers = assignedUsersMatch ? assignedUsersMatch[1].split('|') : [response.data.assigned_to];

    return {
        ...response.data,
        description: response.data.description?.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
        assignedUsers: assignedUsers
    };
};

export const deleteTask = async (taskId) => {
    await axios.delete(
        `${API_URL}/tasks/${taskId}`,
        getAuthHeader()
    );
};