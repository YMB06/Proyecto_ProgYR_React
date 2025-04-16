import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CrearCoche = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    color: '',
    precio: 0
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      await axios.post('http://localhost:8081/api/admin/coches/crear', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/admin/coches');
    } catch (err) {
      setError('Error al crear el coche');
      console.error(err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1>Crear Nuevo Coche</h1>
      
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
          <label htmlFor="imagen">Imagen:</label>
          <input
            type="file"
            id="imagen"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Crear Coche</button>
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