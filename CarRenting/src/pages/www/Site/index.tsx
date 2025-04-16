import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  año: number;
  imagen?: string; 
}

export const Index: React.FC = () => {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getImageUrl = (imageName: string) => {
    return `http://localhost:8081/uploads/coches/${imageName}`;
  };

  const handleImageError = (imageName: string) => {
    if (!imageErrors.has(imageName)) {
      console.error('Error loading image:', imageName);
      setImageErrors(prev => new Set([...prev, imageName]));
    }
  };

  // Obtiene la lista de coches desde el backend
  useEffect(() => {
    const fetchCoches = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/coches');
        console.log('Datos obtenidos:', response.data); // Debugging
        setCoches(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de coches:', error);
      }
    };
    fetchCoches();
  }, []);

  

  return (
    <div>

      {/* Carrusel con los coches */}
      <div id="carCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
  {/* Add indicators */}
  <div className="carousel-indicators">
    {coches.map((_, index) => (
      <button
        key={index}
        type="button"
        data-bs-target="#carCarousel"
        data-bs-slide-to={index}
        className={index === 0 ? 'active' : ''}
        aria-current={index === 0 ? 'true' : 'false'}
        aria-label={`Slide ${index + 1}`}
      ></button>
    ))}
  </div>

  {/* Your existing carousel-inner code */}
  <div className="carousel-inner">
    {coches.map((coche, index) => (
      <div key={coche.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
        <a href={`/coches/${coche.id}`}>
        {coche.imagen ? (
        !imageErrors.has(coche.imagen) ? (
          <img
            src={getImageUrl(coche.imagen)}
            className="d-block w-100"
            style={{ height: '400px', objectFit: 'cover' }}
            alt={`${coche.marca} ${coche.modelo}`}
            onError={() => handleImageError(coche.imagen!)}
          />
        ) : (
          <div className="placeholder-img bg-secondary" 
               style={{ height: '400px', width: '100%' }}>
            <span className="text-white">No imagen disponible</span>
          </div>
        )
      ) : (
        <div className="placeholder-img bg-secondary" 
             style={{ height: '400px', width: '100%' }}>
          <span className="text-white">No imagen disponible</span>
        </div>
      )}

          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50">
            <h5>{`${coche.marca} ${coche.modelo}`}</h5>
            <p>{`Año: ${coche.año} - Precio por día: ${coche.precio}€`}</p>
          </div>
        </a>
      </div>
    ))}
  </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Contenedores con razones para usar nuestro servicio */}
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2>Nuestra Flota de Vehículos</h2>
            <p className="lead">Descubre nuestra amplia selección de coches para alquilar</p>
            <a href="/coches" className="btn btn-primary">Ver todos los coches</a>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2>¿Por qué elegirnos?</h2>
          </div>
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
            <h4>Seguridad Garantizada</h4>
            <p>Todos nuestros vehículos pasan rigurosas inspecciones de seguridad.</p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-currency-euro display-4 text-primary mb-3"></i>
            <h4>Precios Competitivos</h4>
            <p>Ofrecemos las mejores tarifas del mercado sin costes ocultos.</p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-headset display-4 text-primary mb-3"></i>
            <h4>Atención 24/7</h4>
            <p>Servicio de atención al cliente disponible todos los días.</p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2>¿Cómo funciona?</h2>
          </div>
          <div className="col-md-4 text-center mb-3">
            <div className="p-3">
              <i className="bi bi-search display-4 text-success mb-3"></i>
              <h4>1. Elige tu coche</h4>
              <p>Explora nuestra flota y encuentra el vehículo perfecto para ti.</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-3">
            <div className="p-3">
              <i className="bi bi-calendar-check display-4 text-success mb-3"></i>
              <h4>2. Reserva las fechas</h4>
              <p>Selecciona las fechas que necesitas el vehículo.</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-3">
            <div className="p-3">
              <i className="bi bi-key display-4 text-success mb-3"></i>
              <h4>3. Recoge las llaves</h4>
              <p>Recoge tu coche y disfruta de tu viaje.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
