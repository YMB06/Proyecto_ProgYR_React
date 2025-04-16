import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CrearCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    username: '',
    email: '',
    telefono: '',
    dni: '',
    password: '',
    role: 'ROLE_USER'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate data before sending
    if (!formData.nombre || !formData.apellidos || !formData.username || 
        !formData.email || !formData.telefono || !formData.dni || !formData.password) {
        setError('Todos los campos son obligatorios');
        return;
    }

    // Validate DNI format
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(formData.dni)) {
        setError('El DNI debe tener 8 números seguidos de una letra');
        return;
    }

    try {
        // Log the data being sent
        console.log('Sending data:', formData);

        const response = await axios.post(
            'http://localhost:8081/api/admin/clientes/crear',
            {
                ...formData,
                password: formData.password.trim(), // Ensure password is properly formatted
                role: formData.role.startsWith('ROLE_') ? formData.role : `ROLE_${formData.role}`
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            navigate('/admin/clientes');
        }
    } catch (err ) {
        setError('Error al crear el cliente. Por favor, inténtelo de nuevo.');
        console.error('Error creating client:', err);
    }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container-fluid p-4">
      <h1>Crear Nuevo Cliente</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            className="form-control"
            value={formData.apellidos}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            className="form-control"
            value={formData.dni}
            onChange={handleInputChange}
            pattern="[0-9]{8}[A-Za-z]{1}"
            title="Debe introducir 8 números seguidos de una letra"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="ROLE_USER">Usuario</option>
            <option value="ROLE_ADMIN">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Crear Cliente</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/clientes')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};