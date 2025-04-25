import { Route, Routes } from 'react-router-dom';
import { ClientPage } from '../layouts/ClientPage';
import { Index } from '../pages/www/Site';
import Coche from '../pages/www/Coches/Coche';
import { DetalleCoche } from '../pages/www/Coches/detalleCoche';
import { Login } from '../pages/www/Login/Login';
import { Register } from '../pages/www/Register/Register';
import { Alquiler } from '../pages/www/Alquiler/Alquiler';
import { ProtectedRoute } from '../config/ProtectedRoutes';


export const ClientRoutes = () => {
  return (

    
        <Routes>
          {/* Ruta publica */}
          <Route path="/" element={<ClientPage><Index /></ClientPage>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/coches" element={
            <ProtectedRoute>
              <ClientPage><Coche /></ClientPage>
            </ProtectedRoute>
          } />
          <Route path="/coches/:id" element={
            <ProtectedRoute>
              <ClientPage><DetalleCoche /></ClientPage>
            </ProtectedRoute>
          } />
          <Route path="/alquiler" element={
            <ProtectedRoute>
              <ClientPage><Alquiler /></ClientPage>
            </ProtectedRoute>
          } />

          
        </Routes>
  );
};

