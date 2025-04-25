import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface RegisterFormData {
  nombre: string;
  apellidos: string;
  username: string;
  email: string;
  telefono: string;
  dni: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellidos: '',
    username: '',
    email: '',
    telefono: '',
    dni: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const registrationData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        username: formData.username,
        email: formData.email,
        telefono: formData.telefono,
        dni: formData.dni,
        password: formData.password
      };
      
      const response = await axios.post('http://localhost:8081/api/register', 
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log('Response:', response); 
      if (response.status === 200) {
        setSuccess('Registro exitoso');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error details:', error); 
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || 'Error en el registro. Por favor, inténtelo de nuevo.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
      }
    }
};

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registro de Cliente</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario:</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="text"
                id="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI:</label>
              <input
                type="text"
                id="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Registrar
            </button>
          </form>

          <div className="mt-3 text-center">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};