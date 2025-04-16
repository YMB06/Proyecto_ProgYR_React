import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
}

interface Coche {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
}

export const CrearAlquiler = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [coches, setCoches] = useState<Coche[]>([]);
  const [formData, setFormData] = useState({
    cocheId: '',
    clienteId: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_total: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, cochesRes] = await Promise.all([
          axios.get('http://localhost:8081/api/admin/clientes'),
          axios.get('http://localhost:8081/api/admin/coches')
        ]);
        setClientes(clientesRes.data);
        setCoches(cochesRes.data);
      } catch (err) {
        setError('Error al cargar los datos' + err);
      }
    };
    fetchData();
  }, []);

  const calcularPrecioTotal = () => {
    const coche = coches.find(c => c.id.toString() === formData.cocheId);
    if (!coche || !formData.fecha_inicio || !formData.fecha_fin) return;

    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const dias = Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const precioTotal = dias * coche.precio;
    setFormData(prev => ({ ...prev, precio_total: precioTotal }));
  };

  useEffect(() => {
    calcularPrecioTotal();
  }, [formData.cocheId, formData.fecha_inicio, formData.fecha_fin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/admin/alquileres/crear', {
        coche: { id: formData.cocheId },
        cliente: { id: formData.clienteId },
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        precio_total: formData.precio_total
      });
      navigate('/admin/alquileres');
    } catch (err) {
      setError('Error al crear el alquiler' + err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1>Crear Nuevo Alquiler</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="coche">Coche:</label>
          <select
            id="coche"
            className="form-control"
            value={formData.cocheId}
            onChange={(e) => setFormData({...formData, cocheId: e.target.value})}
            required
          >
            <option value="">Seleccione un coche</option>
            {coches.map(coche => (
              <option key={coche.id} value={coche.id}>
                {coche.marca} {coche.modelo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="cliente">Cliente:</label>
          <select
            id="cliente"
            className="form-control"
            value={formData.clienteId}
            onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="fecha_inicio">Fecha de inicio:</label>
          <input
            type="date"
            id="fecha_inicio"
            className="form-control"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="fecha_fin">Fecha de fin:</label>
          <input
            type="date"
            id="fecha_fin"
            className="form-control"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
            min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="precio_total">Precio total:</label>
          <input
            type="number"
            id="precio_total"
            className="form-control"
            value={formData.precio_total}
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">Crear Alquiler</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/alquileres')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};