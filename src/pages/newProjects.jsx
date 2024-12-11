import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const [projectName, setProjectName] = useState("");
  const [duration, setDuration] = useState({ start: "", end: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [methodology, setMethodology] = useState("");
  const navigate = useNavigate();

  // Simulación de usuarios disponibles
  const availableUsers = [
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "Ana Gómez" },
    { id: 3, name: "Carlos López" },
    { id: 4, name: "Lucía Fernández" },
  ];

  // Función para manejar la selección de usuarios
  const handleUserChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selected);
  };

  const handleCreateProject = () => {
    const projectData = {
      projectName,
      duration,
      selectedUsers,
      methodology,
    };

    console.log("Nuevo proyecto creado:", projectData);

    navigate("/proyectos");
  };

  return (
    <div className="p-6 md:ml-64 flex flex-col items-center justify-center">
      {/* Título del formulario */}
      <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
        Crear Nuevo Proyecto
      </h1>

      {/* Formulario */}
      <div className="w-full max-w-xl">
        {/* Nombre del Proyecto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-500 mb-2">Nombre del Proyecto:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ingrese el nombre del proyecto"
          />
        </div>

        {/* Duración del Proyecto */}
        <div className="mb-6 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-primary-500 mb-2">Fecha de Inicio:</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
              value={duration.start}
              onChange={(e) => setDuration({ ...duration, start: e.target.value })}
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-primary-500 mb-2">Fecha de Fin:</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
              value={duration.end}
              onChange={(e) => setDuration({ ...duration, end: e.target.value })}
            />
          </div>
        </div>

        {/* Metodología */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-500 mb-2">Metodología:</label>
          <select
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccionar...</option>
            <option value="scrum">Scrum</option>
            <option value="kanban">Kanban</option>
            <option value="waterfall">Waterfall</option>
          </select>
        </div>

        {/* Selección de Usuarios */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-500 mb-2">Seleccionar Miembros del Equipo:</label>
          <select
            multiple
            value={selectedUsers}
            onChange={handleUserChange}
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
          >
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {/* Mostrar los usuarios seleccionados */}
          <div className="mt-2">
            <h3 className="text-sm font-medium text-primary-500">Usuarios seleccionados:</h3>
            <ul className="list-disc pl-5 text-secondary-700">
              {selectedUsers.length === 0 ? (
                <li>No hay usuarios seleccionados</li>
              ) : (
                selectedUsers.map((userId) => {
                  const user = availableUsers.find((u) => u.id.toString() === userId);
                  return <li key={userId}>{user ? user.name : "Usuario desconocido"}</li>;
                })
              )}
            </ul>
          </div>
        </div>

        {/* Botón para crear el proyecto */}
        <button
          onClick={handleCreateProject}
          className="w-full bg-blue-500 text-white font-poppins py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Crear Proyecto
        </button>
      </div>
    </div>
  );
};

export default NewProject;


