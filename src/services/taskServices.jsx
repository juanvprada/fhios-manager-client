import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = useStore.getState().token;
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const createTask = async (projectId, taskData) => {
    const response = await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        taskData,
        getAuthHeader()
    );
    return response.data;
};

// taskServices.jsx
export const getProjectTasks = async (projectId) => {
    const response = await axios.get(
        `${API_URL}/projects/${projectId}/tasks`,
        getAuthHeader()
    );
    // Usuarios asignados a cada tarea
    return response.data.map(task => ({
        ...task,
        assigned_user: response.data.find(u => u.user_id === task.assigned_to)
    }));
};

export const assignTask = async (taskId, userId) => {
    const response = await axios.post(
        `${API_URL}/tasks/${taskId}/assign`,
        { user_id: userId },
        getAuthHeader()
    );
    return response.data;
};