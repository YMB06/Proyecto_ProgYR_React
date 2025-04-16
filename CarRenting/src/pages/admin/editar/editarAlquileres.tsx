import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

interface Alquiler {
  id: number;
  coche: Coche;
  cliente: Cliente;
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
}

export const EditarAlquiler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [coches, setCoches] = useState<Coche[]>([]);
  const [formData, setFormData] = useState<Alquiler | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alquilerRes, clientesRes, cochesRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/admin/alquileres/${id}`),
          axios.get('http://localhost:8081/api/admin/clientes'),
          axios.get('http://localhost:8081/api/admin/coches')
        ]);
        setFormData(alquilerRes.data);
        setClientes(clientesRes.data);
        setCoches(cochesRes.data);
      } catch (err) {
        setError('Error al cargar los datos' + err);
      }
    };
    fetchData();
  }, [id]);

  const calcularPrecioTotal = () => {
    if (!formData) return;
    
    const coche = coches.find(c => c.id === formData.coche.id);
    if (!coche || !formData.fecha_inicio || !formData.fecha_fin) return;

    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const dias = Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const precioTotal = dias * coche.precio;
    setFormData(prev => prev ? { ...prev, precio_total: precioTotal } : null);
  };

  useEffect(() => {
    if (formData) {
      calcularPrecioTotal();
    }
  }, [formData?.fecha_inicio, formData?.fecha_fin, formData?.coche.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await axios.put(`http://localhost:8081/api/admin/alquileres/editar/${id}`, formData);
      navigate('/admin/alquileres');
    } catch (err) {
      setError('Error al actualizar el alquiler' + err);
    }
  };

  if (!formData) return <div>Cargando...</div>;

  return (
    <div className="container-fluid p-4">
      <h1>Editar Alquiler</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="coche">Coche:</label>
          <select
            id="coche"
            className="form-control"
            value={formData.coche.id}
            onChange={(e) => setFormData({
              ...formData,
              coche: { ...formData.coche, id: parseInt(e.target.value) }
            })}
            required
          >
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
            value={formData.cliente.id}
            onChange={(e) => setFormData({
              ...formData,
              cliente: { ...formData.cliente, id: parseInt(e.target.value) }
            })}
            required
          >
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

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
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