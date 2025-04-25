import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../config/AuthProvider';

export interface LoginResponse {
  success: boolean;
  role: string;
  username: string;
  message?: string;
}

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await axios.post(
        'http://localhost:8081/api/auth/login',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
  
      console.log('Login response:', response.data);
  
      if (response.data.success && response.data.role) {
        setSuccess('Login exitoso');
        
        login(response.data.role);
        
        console.log('Role set:', response.data.role);
  
        // si es un admin lo redirige a la pagina de administrador
        if (response.data.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(response.data.message || 'Error en la autenticación');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Usuario o contraseña incorrectos');
      } else {
        setError('Error en el servidor');
      }
    }
  };

  return (
    <div className="container mt-5">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};