import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../config/AuthProvider';

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
}

interface Alquiler {
  id: number;
  coche: Coche;
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
}

export const Alquiler = () => {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [formData, setFormData] = useState({
    cocheId: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_total: 0
  });
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load rentals and cars
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alquileresRes] = await Promise.all([
          axios.get<Alquiler[]>('http://localhost:8081/api/alquileres'),
        ]);

       

        if (Array.isArray(alquileresRes.data)) {
          setAlquileres(alquileresRes.data);
        } else {
          console.error('Alquileres data is not an array:', alquileresRes.data);
          setAlquileres([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.');
        setAlquileres([]); // Set empty array on error
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);



  // Calculate price when dates or car changes
  useEffect(() => {
    const calcularPrecio = async () => {
      if (!formData.cocheId || !formData.fecha_inicio || !formData.fecha_fin) return;

      try {
        const response = await axios.get(`http://localhost:8081/api/alquileres/calcular-precio`, {
          params: {
            cocheId: formData.cocheId,
            fechaInicio: formData.fecha_inicio,
            fechaFin: formData.fecha_fin
          }
        });

        setFormData(prev => ({
          ...prev,
          precio_total: response.data.precioTotal
        }));
      } catch (err) {
        console.error('Error calculating price:', err);
      }
    };

    calcularPrecio();
  }, [formData.cocheId, formData.fecha_inicio, formData.fecha_fin]);



     

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4 text-center">
        <i className="bi bi-car-front"></i> Alquiler de Coches
      </h1>
  
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i> {error}
        </div>
      )}
  
      <h2 className="mb-3 text-center">
        <i className="bi bi-calendar-check"></i> Mis Alquileres
      </h2>
  
      {alquileres.length > 0 ? (
        <div className="row">
          {alquileres.map((alquiler) => (
            <div key={alquiler.id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <i className="bi bi-car-front-fill"></i> {alquiler.coche.marca} {alquiler.coche.modelo}
                  </h5>
                  <p className="card-text">
                    <i className="bi bi-calendar-day"></i> <strong>Fecha inicio:</strong> {new Date(alquiler.fecha_inicio).toLocaleDateString()}<br />
                    <i className="bi bi-calendar"></i> <strong>Fecha fin:</strong> {new Date(alquiler.fecha_fin).toLocaleDateString()}<br />
                    <i className="bi bi-cash"></i> <strong>Precio total:</strong> {alquiler.precio_total}€
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          <i className="bi bi-info-circle"></i> No tienes alquileres activos
        </div>
      )}
    </div>
  );

};