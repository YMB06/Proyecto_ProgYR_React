import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  username: string;
  email: string;
  telefono: string;
  dni: string;
  role: string;
}

export const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/admin/clientes/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del cliente');
        console.error(err);
      }
    };
    fetchCliente();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const dataToSend = {
        ...formData,
        // solo incluye la contraseeña sis eha cambiado
        ...(changePassword && { password: newPassword }),
        role: formData.role.startsWith('ROLE_') ? formData.role : `ROLE_${formData.role}`
      };

      const response = await axios.put(
        `http://localhost:8081/api/admin/clientes/editar/${id}`,
        dataToSend,
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
      setError('Error al actualizar el cliente. Asegúrate de que todos los campos son correctos.');
      console.error(err);
    }
  };

  if (!formData) return <div>Cargando...</div>;

  return (
    <div className="container-fluid p-4">
      <h1>Editar Cliente</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            className="form-control"
            value={formData.apellidos}
            onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            className="form-control"
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
            pattern="[0-9]{8}[A-Za-z]{1}"
            title="Debe introducir 8 números seguidos de una letra"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            className="form-control"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="ROLE_USER">Usuario</option>
            <option value="ROLE_ADMIN">Administrador</option>
          </select>
        </div>

       {/* Password change section */}
<div className="form-group mb-3">
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="changePassword"
      checked={changePassword}
      onChange={(e) => {
        setChangePassword(e.target.checked);
        if (!e.target.checked) {
          setNewPassword(''); 
        }
      }}
    />
    <label className="form-check-label" htmlFor="changePassword">
      Cambiar contraseña
    </label>
  </div>
</div>

{changePassword && (
  <div className="form-group mb-3">
    <label htmlFor="newPassword">Nueva contraseña:</label>
    <input
      type="password"
      id="newPassword"
      className="form-control"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required={changePassword}
      minLength={6}
    />
  </div>
)}

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
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