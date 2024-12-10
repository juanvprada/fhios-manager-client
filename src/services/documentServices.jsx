import axios from 'axios';

export const createDocument = async (file, taskId, title, uploadedBy) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', taskId);
    formData.append('title', title);
    formData.append('uploaded_by', uploadedBy);

    const response = await axios.post('/api/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};


export const getDocumentsByTaskId = async (taskId) => {
    const response = await axios.get(`/api/documents?task_id=${taskId}`);
    return response.data;
};

export const getDocumentById = async (documentId) => {
    const response = await axios.get(`/api/documents/${documentId}`);
    return response.data;
};

export const updateDocument = async (documentId, documentData) => {
    const response = await axios.put(`/api/documents/${documentId}`, documentData);
    return response.data;
};

export const deleteDocument = async (documentId) => {
    await axios.delete(`/api/documents/${documentId}`);
};