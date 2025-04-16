import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
interface LoginResponse {
  success?: boolean;
  message?: string;
}
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post<LoginResponse>(
        'http://localhost:8081/api/auth/login', 
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      if (response.data.success) {
        setSuccess('¡Login exitoso!');
        // Redirect to root page instead of admin
        navigate('/');
      } else {
        setError(response.data.message || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Usuario o contraseña incorrectos.';
        setError(message);
      } else {
        setError('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
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