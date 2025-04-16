import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [coche, setCoche] = useState<Coche | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [precioTotal, setPrecioTotal] = useState<number | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<{ mensaje: string; exito: boolean } | null>(null);

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

  const getImageUrl = (imageName: string) => {
    return `http://localhost:8081/uploads/coches/${imageName}`;
  };

  const checkAvailabilityAndCalculatePrice = async () => {
    if (!fechaInicio || !fechaFin || !coche) return;
  
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
  
    if (end <= start) {
      setDisponibilidad({
        mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio',
        exito: false
      });
      return;
    }
  
    // Calculate days (including start and end days)
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate total price
    const total = days * coche.precio;
    setPrecioTotal(total);
  
    try {
      const response = await axios.get(`http://localhost:8081/api/alquiler/check-availability`, {
        params: {
          cocheId: coche.id,
          startDate: fechaInicio,
          endDate: fechaFin
        }
      });
      
      setDisponibilidad({
        mensaje: response.data ? '¡Vehículo disponible para estas fechas!' : 'Lo sentimos, el vehículo no está disponible para estas fechas.',
        exito: response.data
      });
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      setDisponibilidad({
        mensaje: 'Error al verificar disponibilidad',
        exito: false
      });
    }
  };


  if (!coche) {
    return <div className="text-center">Cargando detalles del coche...</div>;
  }
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {/* Imagen del coche */}
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

        {/* Detalles del coche */}
        <div className="col-12 col-md-6">
          <h2 className="h3 mb-4">{`${coche.marca} ${coche.modelo}`}</h2>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Detalles del Vehículo</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-calendar3 text-primary"></i>
                  <strong>Año:</strong>
                  <span className="ms-2">{coche.año}</span>
                </li>
                <li className="mb-3">
                  <i className="bi bi-palette text-primary"></i>
                  <strong>Color:</strong>
                  <span className="ms-2">{coche.color}</span>
                </li>
                <li className="mb-3">
                  <i className="bi bi-currency-euro text-primary"></i>
                  <strong>Precio por día:</strong>
                  <span className="ms-2">{`${coche.precio}€`}</span>
                </li>
              </ul>

              {/* Formulario de reserva */}
              <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">Fecha de inicio:</label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      checkAvailabilityAndCalculatePrice();
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha_fin" className="form-label">Fecha de fin:</label>
                  <input
                    type="date"
                    id="fecha_fin"
                    className="form-control"
                    min={fechaInicio || new Date().toISOString().split('T')[0]}
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value);
                      checkAvailabilityAndCalculatePrice();
                    }}
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
                    disabled={!disponibilidad?.exito}
                  >
                    <i className="bi bi-calendar-plus me-2"></i>Reservar Ahora
                  </button>
                  <a href="/coches" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Volver
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};