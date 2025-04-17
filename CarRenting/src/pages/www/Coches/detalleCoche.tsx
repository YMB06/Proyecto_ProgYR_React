import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export const DetalleCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coche, setCoche] = useState<Coche | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [precioTotal, setPrecioTotal] = useState<number | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<{ mensaje: string; exito: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch car details
  useEffect(() => {
    const fetchCoche = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/coches/${id}`);
        setCoche(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del coche:', error);
      }
    };
    fetchCoche();
  }, [id]);

  // Calculate price and check availability when dates change
  useEffect(() => {
    const calculatePriceAndAvailability = async () => {
      if (!fechaInicio || !fechaFin || !coche) {
        setPrecioTotal(null);
        setDisponibilidad(null);
        return;
      }

      const start = new Date(fechaInicio);
      const end = new Date(fechaFin);

      if (end <= start) {
        setDisponibilidad({
          mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio',
          exito: false
        });
        setPrecioTotal(null);
        return;
      }

      // Calculate days (including start and end days)
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const total = days * coche.precio;
      setPrecioTotal(total);

      try {
        const response = await axios.get(`http://localhost:8081/api/alquileres/check-availability`, {
          params: {
            cocheId: coche.id,
            fechaInicio,
            fechaFin
          }
        });

        setDisponibilidad({
          mensaje: response.data.available ? 
            '¡Vehículo disponible para estas fechas!' : 
            'Lo sentimos, el vehículo no está disponible para estas fechas.',
          exito: response.data.available
        });
      } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        setDisponibilidad({
          mensaje: 'Error al verificar disponibilidad',
          exito: false
        });
      }
    };

    calculatePriceAndAvailability();
  }, [fechaInicio, fechaFin, coche]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8081/api/alquileres',
        {
          cocheId: coche?.id,        // Changed from nested object to simple ID
          clienteId: 1,              // Hardcoded for now - replace with actual user ID
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: precioTotal
        }
      );
  
      if (response.status === 201 || response.status === 200) {
        navigate('/alquiler', { 
          state: { 
            success: true,
            message: 'Alquiler creado con éxito'
          } 
        });
      }
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      let errorMessage = 'Error al procesar la reserva. Por favor, inténtelo de nuevo.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setDisponibilidad({
        mensaje: errorMessage,
        exito: false
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageName: string) => {
    return `http://localhost:8081/uploads/coches/${imageName}`;
  };

  if (!coche) {
    return <div className="text-center">Cargando detalles del coche...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {/* Car Image */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card shadow-sm">
            {coche.imagen && (
              <img
                src={getImageUrl(coche.imagen)}
                className="card-img-top"
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                alt={`${coche.marca} ${coche.modelo}`}
              />
            )}
          </div>
        </div>

        {/* Car Details */}
        <div className="col-12 col-md-6">
          <h2 className="h3 mb-4">{`${coche.marca} ${coche.modelo}`}</h2>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Detalles del Vehículo</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-calendar3 text-primary me-2"></i>
                  <strong>Año:</strong> {coche.año}
                </li>
                <li className="mb-3">
                  <i className="bi bi-palette text-primary me-2"></i>
                  <strong>Color:</strong> {coche.color}
                </li>
                <li className="mb-3">
                  <i className="bi bi-currency-euro text-primary me-2"></i>
                  <strong>Precio por día:</strong> {coche.precio}€
                </li>
              </ul>

              {/* Rental Form */}
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">
                    Fecha de inicio:
                  </label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha_fin" className="form-label">
                    Fecha de fin:
                  </label>
                  <input
                    type="date"
                    id="fecha_fin"
                    className="form-control"
                    min={fechaInicio || new Date().toISOString().split('T')[0]}
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </div>

                {precioTotal !== null && (
                  <div className="alert alert-info mb-3">
                    Precio total: {precioTotal.toFixed(2)}€
                  </div>
                )}

                {disponibilidad && (
                  <div className={`alert alert-${disponibilidad.exito ? 'success' : 'danger'} mb-3`}>
                    {disponibilidad.mensaje}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!disponibilidad?.exito || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-plus me-2"></i>
                        Reservar Ahora
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/coches')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};