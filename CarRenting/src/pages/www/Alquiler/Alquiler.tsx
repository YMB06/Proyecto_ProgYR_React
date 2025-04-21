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

      if (response.data && typeof response.data.precioTotal === 'number') {
        setFormData(prev => ({
          ...prev,
          precio_total: response.data.precioTotal
        }));
      } else {
        console.error('Invalid price data received:', response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error calculating price:', err.response?.data || err.message);
        setError('Error al calcular el precio. Por favor, inténtelo de nuevo.');
      } else {
        console.error('Unexpected error:', err);
        setError('Error inesperado al calcular el precio.');
      }
    }
  };

  calcularPrecio();
}, [formData.cocheId, formData.fecha_inicio, formData.fecha_fin]);


     // Add this before the return statement
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!formData.cocheId || !formData.fecha_inicio || !formData.fecha_fin) {
    setError('Por favor complete todos los campos');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8081/api/alquileres', {
      cocheId: parseInt(formData.cocheId),
      fechaInicio: formData.fecha_inicio,
      fechaFin: formData.fecha_fin,
      precioTotal: formData.precio_total
    });

    if (response.data) {
      // Refresh the rentals list
      const alquileresRes = await axios.get<Alquiler[]>('http://localhost:8081/api/alquileres');
      setAlquileres(alquileresRes.data);
      
      // Reset form
      setFormData({
        cocheId: '',
        fecha_inicio: '',
        fecha_fin: '',
        precio_total: 0
      });
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.error || 'Error al crear el alquiler';
      setError(errorMessage);
      console.error('Error creating rental:', err.response?.data);
    } else {
      setError('Error inesperado al crear el alquiler');
      console.error('Unexpected error:', err);
    }
  }
};

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
      // Add this inside your return statement, before the alquileres list
<form onSubmit={handleSubmit} className="mb-4">
  <div className="row g-3">
    <div className="col-md-4">
      <label className="form-label">Coche</label>
      <select 
        className="form-select"
        value={formData.cocheId}
        onChange={(e) => setFormData({...formData, cocheId: e.target.value})}
        required
      >
        <option value="">Seleccione un coche</option>
        {/* Add your car options here */}
      </select>
    </div>
    <div className="col-md-3">
      <label className="form-label">Fecha de inicio</label>
      <input
        type="date"
        className="form-control"
        value={formData.fecha_inicio}
        onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
        required
      />
    </div>
    <div className="col-md-3">
      <label className="form-label">Fecha de fin</label>
      <input
        type="date"
        className="form-control"
        value={formData.fecha_fin}
        onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
        required
      />
    </div>
    <div className="col-md-2">
      <label className="form-label">Precio Total</label>
      <input
        type="number"
        className="form-control"
        value={formData.precio_total}
        readOnly
      />
    </div>
    <div className="col-12">
      <button type="submit" className="btn btn-primary">
        <i className="bi bi-plus-circle me-2"></i>Crear Alquiler
      </button>
    </div>
  </div>
</form>
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