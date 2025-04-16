import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  precio: number;
  imagen?: string;
}

export const AdminCoches = () => {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoches();
  }, []);

  const fetchCoches = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/admin/coches');
      setCoches(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los coches' + err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este coche?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/admin/coches/borrar/${id}`);
      fetchCoches();
    } catch (err) {
      setError('Error al eliminar el coche' + err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="row mb-3">
        <div className="col-12">
          <Link to="/admin/coches/crear" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Nuevo Coche
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Color</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {coches.map(coche => (
              <tr key={coche.id}>
                <td>{coche.id}</td>
                <td>
                  {coche.imagen && (
                    <img
                      src={`http://localhost:8081/uploads/coches/${coche.imagen}`}
                      alt={`${coche.marca} ${coche.modelo}`}
                      style={{ height: '50px' }}
                    />
                  )}
                </td>
                <td>{coche.marca}</td>
                <td>{coche.modelo}</td>
                <td>{coche.año}</td>
                <td>{coche.color}</td>
                <td>{coche.precio.toFixed(2)}€</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/admin/coches/editar/${coche.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(coche.id)}
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