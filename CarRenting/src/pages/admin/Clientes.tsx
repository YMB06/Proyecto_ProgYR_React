import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export const AdminClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/admin/clientes');
      setClientes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los clientes' + err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/admin/clientes/borrar/${id}`);
      fetchClientes();
    } catch (err) {
      setError('Error al eliminar el cliente' +err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="row mb-3">
        <div className="col-12">
          <Link to="/admin/clientes/crear" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Nuevo Cliente
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellidos}</td>
                <td>{cliente.username}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.dni}</td>
                <td>{cliente.role}</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/admin/clientes/editar/${cliente.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-trash"></i> Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};