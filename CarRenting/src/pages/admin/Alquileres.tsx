import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Alquiler {
  id: number;
  coche: {
    id: number;
    marca: string;
    modelo: string;
  };
  cliente: {
    id: number;
    nombre: string;
    apellidos: string;
  };
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
}

export const AdminAlquileres = () => {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlquileres();
  }, []);

  const fetchAlquileres = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/admin/alquileres');
      setAlquileres(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los alquileres' + err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este alquiler?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/admin/alquileres/eliminar/${id}`);
      fetchAlquileres();
    } catch (err) {
      setError('Error al eliminar el alquiler' + err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="row mb-3">
        <div className="col-12">
          <Link to="/admin/alquileres/crear" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Nuevo Alquiler
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Coche</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Precio Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alquileres.map(alquiler => (
              <tr key={alquiler.id}>
                <td>{alquiler.id}</td>
                <td>{`${alquiler.cliente.nombre} ${alquiler.cliente.apellidos}`}</td>
                <td>{`${alquiler.coche.marca} ${alquiler.coche.modelo}`}</td>
                <td>{new Date(alquiler.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(alquiler.fecha_fin).toLocaleDateString()}</td>
                <td>{alquiler.precio_total.toFixed(2)}€</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/admin/alquileres/editar/${alquiler.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(alquiler.id)}
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