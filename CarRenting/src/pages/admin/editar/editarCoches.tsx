import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export const EditarCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Coche>({
    id: 0,
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    color: '',
    precio: 0
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoche = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/admin/coches/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del coche');
        console.error(err);
      }
    };
    fetchCoche();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (imagen) {
      data.append('file', imagen);
    }

    try {
      await axios.put(`http://localhost:8081/api/admin/coches/editar/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/admin/coches');
    } catch (err) {
      setError('Error al actualizar el coche');
      console.error(err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1>Editar Coche</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            className="form-control"
            value={formData.marca}
            onChange={(e) => setFormData({...formData, marca: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            id="modelo"
            className="form-control"
            value={formData.modelo}
            onChange={(e) => setFormData({...formData, modelo: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="año">Año:</label>
          <input
            type="number"
            id="año"
            className="form-control"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.año}
            onChange={(e) => setFormData({...formData, año: parseInt(e.target.value)})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="color">Color:</label>
          <input
            type="text"
            id="color"
            className="form-control"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="precio">Precio por día:</label>
          <input
            type="number"
            id="precio"
            className="form-control"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value)})}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="imagen">Nueva Imagen:</label>
          <input
            type="file"
            id="imagen"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
          />
          {formData.imagen && (
            <img
              src={`http://localhost:8081/uploads/coches/${formData.imagen}`}
              alt="Vista previa"
              className="mt-2"
              style={{ maxWidth: '200px' }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/coches')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};