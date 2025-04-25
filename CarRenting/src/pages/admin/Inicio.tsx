import { useState, useEffect } from 'react';
import axios from 'axios';

interface AdminSummary {
  totalCoches: number;
  totalAlquileres: number;
  totalClientes: number;
  totalIngresos: number;
  ultimosAlquileres: Array<{
    id: number;
    fecha_inicio: string;
    fecha_fin: string;
    precio_total: number;
    cliente: {
      nombre: string;
      apellidos: string;
    };
    coche: {
      marca: string;
      modelo: string;
    };
  }>;
}

export const AdminDashboard = () => {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get<AdminSummary>('http://localhost:8081/api/admin/index');
        setSummary(response.data);
      } catch (err) {
        setError('Error al cargar el resumen administrativo');
        console.error('Error fetching admin summary:', err);
      }
    };

    fetchSummary();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!summary) {
    return <div className="spinner-border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Panel de Administración</h1>
      
      {/* Estadisticas de la empresa */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Coches</h5>
              <h2>{summary.totalCoches}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Alquileres</h5>
              <h2>{summary.totalAlquileres}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Clientes</h5>
              <h2>{summary.totalClientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Ingresos Totales</h5>
              <h2>{summary.totalIngresos.toFixed(2)}€</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos alquileres */}
      <div className="card">
        <div className="card-header">
          <h3>Últimos Alquileres</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Coche</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {summary.ultimosAlquileres.map(alquiler => (
                  <tr key={alquiler.id}>
                    <td>{alquiler.id}</td>
                    <td>{`${alquiler.cliente.nombre} ${alquiler.cliente.apellidos}`}</td>
                    <td>{`${alquiler.coche.marca} ${alquiler.coche.modelo}`}</td>
                    <td>{new Date(alquiler.fecha_inicio).toLocaleDateString()}</td>
                    <td>{new Date(alquiler.fecha_fin).toLocaleDateString()}</td>
                    <td>{alquiler.precio_total.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enlaces a las tablas */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestión de Coches</h5>
              <p className="card-text">Administrar el inventario de vehículos</p>
              <a href="/admin/coches" className="btn btn-primary">
                Gestionar Coches
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestión de Clientes</h5>
              <p className="card-text">Administrar los usuarios registrados</p>
              <a href="/admin/clientes" className="btn btn-primary">
                Gestionar Clientes
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestión de Alquileres</h5>
              <p className="card-text">Administrar las reservas activas</p>
              <a href="/admin/alquileres" className="btn btn-primary">
                Gestionar Alquileres
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};