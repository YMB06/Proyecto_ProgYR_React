import { Route, Routes } from 'react-router-dom';
import { ClientPage } from '../layouts/ClientPage';
import { Index } from '../pages/www/Site';
import Coche from '../pages/www/Coches/Coche';
import { DetalleCoche } from '../pages/www/Coches/detalleCoche';
import { Login } from '../pages/www/Login/Login';
import { Register } from '../pages/www/Register/Register';
import { Alquiler } from '../pages/www/Alquiler/Alquiler';

export const ClientRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<ClientPage><Index /></ClientPage>} />
        <Route path="/coches" element={<ClientPage><Coche /></ClientPage>} />
        <Route path="/coches/:id" element={<ClientPage><DetalleCoche /></ClientPage>} />
        <Route path="/alquiler" element={<ClientPage><Alquiler /></ClientPage>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
  );
};

