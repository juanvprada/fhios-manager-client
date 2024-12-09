import PropTypes from 'prop-types';

const ChangePasswordForm = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    onSubmit({ currentPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="currentPassword">Contraseña actual:</label>
        <input type="password" name="currentPassword" id="currentPassword" required />
      </div>
      <div>
        <label htmlFor="newPassword">Nueva contraseña:</label>
        <input type="password" name="newPassword" id="newPassword" required />
      </div>
      <button type="submit">Cambiar contraseña</button>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Validación de PropTypes
};

export default ChangePasswordForm;
