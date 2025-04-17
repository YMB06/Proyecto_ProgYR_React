import { useState, useEffect } from "react";
import axios from "axios";

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  año: number;
  color: string; 
  imagen: string; 
}

const Coche = () => {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Función para obtener la URL de las imágenes
  const getImageUrl = (imageName: string | undefined) => {
    if (!imageName) return '';
    return `http://localhost:8081/uploads/coches/${imageName}`;
  };

  // Manejo de errores al cargar imágenes
  const handleImageError = (imageName: string) => {
    if (!imageErrors.has(imageName)) {
      console.error("Error loading image:", imageName);
      setImageErrors((prev) => new Set([...prev, imageName]));
    }
  };

  // Fetch de datos desde el backend
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
    <div className="container py-4">
      {/* Título */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center">Nuestros Vehículos</h1>
          <p className="lead text-center">Encuentra el coche perfecto para tu viaje</p>
        </div>
      </div>

      {/* Grid de tarjetas de coches */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {coches.map((coche) => (  // Fixed parameter order: item first, then index
          <div key={coche.id} className="col">
            <div className="card h-100 shadow-sm hover-effect">
              {/* Imagen */}
              {coche.imagen ? (
                !imageErrors.has(coche.imagen) ? (
                  <img
                    src={getImageUrl(coche.imagen)}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    alt={`${coche.marca} ${coche.modelo}`}
                    onError={() => handleImageError(coche.imagen!)}
                  />
                ) : (
                  <div
                    className="placeholder-img bg-secondary"
                    style={{ height: "200px", width: "100%" }}
                  >
                    <span className="text-white">No imagen disponible</span>
                  </div>
                )
              ) : (
                <div
                  className="placeholder-img bg-secondary"
                  style={{ height: "200px", width: "100%" }}
                >
                  <span className="text-white">No imagen disponible</span>
                </div>
              )}

              {/* Detalles */}
              <div className="card-body">
                <h5 className="card-title fw-bold">
                  {`${coche.marca} ${coche.modelo}`}
                </h5>
                <div className="card-text">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-calendar3"></i> Año: {coche.año}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-palette"></i> Color: {coche.color}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-currency-euro"></i> Precio por día: {coche.precio}€
                    </li>
                  </ul>
                </div>
              </div>

              {/* Botón de detalles */}
              <div className="card-footer bg-transparent border-top-0">
                <div className="d-grid">
                  <a href={`/coches/${coche.id}`} className="btn btn-primary">
                    <i className="bi bi-info-circle me-2"></i>Ver Detalles
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coche;
