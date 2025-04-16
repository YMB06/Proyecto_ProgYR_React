import { useState, useEffect } from 'react';
import axios from 'axios';

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
}

export const Alquiler = () => {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [formData, setFormData] = useState({
    cocheId: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_total: 0
  });
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Cargar coches disponibles
  useEffect(() => {
    const fetchCoches = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/coches');
        setCoches(response.data);
      } catch (err) {
        setError('Error al cargar los coches: ' + err);
      }
    };
    fetchCoches();
  }, []);

  // Calcular precio total cuando cambian cocheId o fechas
  useEffect(() => {
    const calcularPrecioLocal = () => {
      if (!formData.cocheId || !formData.fecha_inicio || !formData.fecha_fin) return;

      const coche = coches.find(c => c.id.toString() === formData.cocheId);
      if (!coche) return;

      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      const dias = Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Evitar precios negativos
      if (dias < 1) return;

      const precioTotal = dias * coche.precio;

      setFormData(prev => ({
        ...prev,
        precio_total: precioTotal
      }));
    };

    calcularPrecioLocal();
  }, [formData.cocheId, formData.fecha_inicio, formData.fecha_fin, coches]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'fecha_inicio' | 'fecha_fin') => {
    const newValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/alquiler/reservar', null, {
        params: {
          cocheId: formData.cocheId,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin,
          precio_total: formData.precio_total
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('¡Reserva realizada con éxito!');
      setFormData({
        cocheId: '',
        fecha_inicio: '',
        fecha_fin: '',
        precio_total: 0
      });
    } catch (err) {
      console.error('Error al realizar la reserva:', err);
      setError('Error al realizar la reserva.');
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1>Reservar Coche</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Coche:</label>
          <select
            className="form-control"
            value={formData.cocheId}
            onChange={(e) => setFormData({ ...formData, cocheId: e.target.value })}
            required
          >
            <option value="">Seleccione un coche</option>
            {coches.map(coche => (
              <option key={coche.id} value={coche.id}>
                {coche.marca} {coche.modelo} - {coche.precio}€/día
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Fecha de inicio:</label>
          <input
            type="date"
            className="form-control"
            value={formData.fecha_inicio}
            onChange={(e) => handleDateChange(e, 'fecha_inicio')}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Fecha de fin:</label>
          <input
            type="date"
            className="form-control"
            value={formData.fecha_fin}
            onChange={(e) => handleDateChange(e, 'fecha_fin')}
            min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Precio total:</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={formData.precio_total}
              readOnly
            />
            <span className="input-group-text">€</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Reservar</button>
      </form>
    </div>
  );
};
