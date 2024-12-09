import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import PropTypes from "prop-types";

const TaskForm = ({ onSubmit, onClose, availableUsers }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        assigned_to: ''
    });

    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...taskData, assigned_to: selectedUsers.join(',') });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Nueva Tarea</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Título
                        </label>
                        <input
                            type="text"
                            required
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <textarea
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha límite
                        </label>
                        <input
                            type="date"
                            value={taskData.due_date}
                            onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Prioridad
                        </label>
                        <select
                            value={taskData.priority}
                            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Asignar a
                        </label>
                        <div className="border border-gray-300 rounded-lg w-full p-3 max-h-[300px] overflow-y-auto">
                            {availableUsers.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="flex items-center p-2 hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        id={`user-${user.user_id}`}
                                        value={user.user_id}
                                        checked={selectedUsers.includes(user.user_id.toString())}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers([...selectedUsers, e.target.value]);
                                            } else {
                                                setSelectedUsers(selectedUsers.filter(id => id !== e.target.value));
                                            }
                                        }}
                                        className="mr-3"
                                    />
                                    <label htmlFor={`user-${user.user_id}`}>
                                        {user.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lista de usuarios seleccionados */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-primary-500 mb-2">
                            Usuarios seleccionados ({selectedUsers.length}):
                        </h3>
                        <ul className="list-disc pl-5 text-secondary-700 space-y-1">
                            {selectedUsers.length === 0 ? (
                                <li>No hay usuarios seleccionados</li>
                            ) : (
                                selectedUsers.map((userId) => {
                                    const user = availableUsers.find(u => u.user_id.toString() === userId);
                                    return (
                                        <li key={userId} className="flex justify-between items-center">
                                            <span>{user?.name || "Usuario desconocido"}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedUsers(selectedUsers.filter(id => id !== userId));
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
                        >
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

//validación de las props
TaskForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    availableUsers: PropTypes.arrayOf(PropTypes.shape({
        user_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })
).isRequired,
};


export default TaskForm;