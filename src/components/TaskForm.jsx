import PropTypes from 'prop-types'; // Importa PropTypes
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ onSubmit, onClose, availableUsers }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    assigned_to: '',
    estimated_hours: 0,
  });

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...taskData, assigned_to: selectedUsers.join(',') });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md sm:p-8 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nueva Tarea</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 sm:text-base">
              Título
            </label>
            <input
              type="text"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 sm:text-base">
              Descripción
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
              rows="3"
            />
          </div>

          {/* Otros campos aquí... */}

          <div>
            <label className="block text-sm font-medium text-gray-700 sm:text-base">
              Asignar a
            </label>
            <div className="border border-gray-300 rounded-lg w-full p-3 max-h-[300px] overflow-y-auto sm:text-sm">
              {availableUsers && availableUsers.length > 0 ? (
                availableUsers.map((user) => (
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
                          setSelectedUsers(selectedUsers.filter((id) => id !== e.target.value));
                        }
                      }}
                      className="mr-3"
                    />
                    <label htmlFor={`user-${user.user_id}`}>
                      {user.name}
                    </label>
                  </div>
                ))
              ) : (
                <p>No users available</p>
              )}
            </div>
          </div>

          {/* Otros campos y botones aquí... */}
        </form>
      </div>
    </div>
  );
};

// Agrega las validaciones de PropTypes
TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired, // onSubmit debe ser una función y es obligatorio
  onClose: PropTypes.func.isRequired,  // onClose debe ser una función y es obligatorio
  availableUsers: PropTypes.arrayOf(PropTypes.object).isRequired, // availableUsers debe ser un arreglo de objetos y es obligatorio
};

export default TaskForm;
