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
interface FilterState {
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  searchTerm: string;
}

const Coche = () => {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 1000,
    maxYear: new Date().getFullYear(),
    searchTerm: ''
  });
  const [filteredCoches, setFilteredCoches] = useState<Coche[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
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

useEffect(() => {
  setFilteredCoches(coches); 
}, [coches]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...coches];
  
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(coche => 
          coche.marca.toLowerCase().includes(searchLower) ||
          coche.modelo.toLowerCase().includes(searchLower)
        );
      }
  
      filtered = filtered.filter(coche => 
        coche.precio >= filters.minPrice &&
        coche.precio <= filters.maxPrice
      );
  
      filtered = filtered.filter(coche => 
        coche.año >= filters.minYear &&
        coche.año <= filters.maxYear
      );
  
      setFilteredCoches(filtered);
    };
  
    applyFilters();
  }, [coches, filters]);
  return (
    <div className="container py-4">
      {/* Título */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center">Nuestros Vehículos</h1>
          <p className="lead text-center">Encuentra el coche perfecto para tu viaje</p>
        </div>
      </div>
      <div className="row mb-4">
  <div className="col-12">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <button 
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
      >
        <i className="bi bi-funnel"></i>
        Filtros
        <span className="badge bg-light text-primary">
          {Object.values(filters).filter(value => value !== '').length}
        </span>
      </button>

      <span className="text-muted">
        {filteredCoches.length} vehículos encontrados
      </span>
    </div>

    <div className={`collapse ${isFiltersVisible ? 'show' : ''}`}>
      <div className="card shadow-sm border-0">
        <div className="card-body bg-light">
          <div className="row g-3">
            {/* Search */}
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por marca o modelo..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    searchTerm: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3">
                    <i className="bi bi-currency-euro me-2"></i>
                    Precio por día
                  </h6>
                  <div className="d-flex gap-2">
                    <div className="input-group">
                      <span className="input-group-text">€</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          minPrice: Number(e.target.value)
                        }))}
                      />
                    </div>
                    <div className="input-group">
                      <span className="input-group-text">€</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          maxPrice: Number(e.target.value)
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3">
                    <i className="bi bi-calendar3 me-2"></i>
                    Año del vehículo
                  </h6>
                  <div className="d-flex gap-2">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-caret-right-fill"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Desde"
                        value={filters.minYear}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          minYear: Number(e.target.value)
                        }))}
                      />
                    </div>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-caret-left-fill"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Hasta"
                        value={filters.maxYear}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          maxYear: Number(e.target.value)
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="col-12">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setFilters({
                  minPrice: 0,
                  maxPrice: 1000000,
                  minYear: 1000,
                  maxYear: new Date().getFullYear(),
                  searchTerm: ''
                })}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Restablecer filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      {/* Grid de tarjetas de coches */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredCoches.map((coche) => (  // Fixed parameter order: item first, then index
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
