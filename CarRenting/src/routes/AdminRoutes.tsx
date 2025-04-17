

import { Route, Routes } from 'react-router-dom';
import { AdminPage } from '../layouts/AdminPage';
import { AdminDashboard } from '../pages/admin/Inicio';
import { AdminClientes } from '../pages/admin/Clientes';
import { AdminCoches } from '../pages/admin/Coches';
import { AdminAlquileres } from '../pages/admin/Alquileres';
import { CrearCliente } from '../pages/admin/crear/crearClientes';
import { CrearCoche } from '../pages/admin/crear/crearCoches';
import { CrearAlquiler } from '../pages/admin/crear/crearAlquileres';
import { EditarCliente } from '../pages/admin/editar/editarClientes';
import { EditarCoche } from '../pages/admin/editar/editarCoches';
import { EditarAlquiler } from '../pages/admin/editar/editarAlquileres';
import { ProtectedRoute } from '../config/ProtectedRoutes';


export const AdminRoutes = () => {
  return (
    <ProtectedRoute>

            <Routes>
              
            <Route path="/" element={<AdminPage><AdminDashboard /></AdminPage>} />
               <Route path="/clientes" element={<AdminPage><AdminClientes /></AdminPage>} />
               <Route path="/coches" element={<AdminPage><AdminCoches /></AdminPage>} />
               <Route path="/alquileres" element={<AdminPage><AdminAlquileres /></AdminPage>} />
               <Route path="/clientes/crear" element={<AdminPage><CrearCliente /></AdminPage>} />
               <Route path="/coches/crear" element={<AdminPage><CrearCoche /></AdminPage>} />
               <Route path="/alquileres/crear" element={<AdminPage><CrearAlquiler /></AdminPage>} />
               <Route path="/clientes/editar/:id" element={<AdminPage><EditarCliente /></AdminPage>} />
               <Route path="/coches/editar/:id" element={<AdminPage><EditarCoche /></AdminPage>} />
               <Route path="/alquileres/editar/:id" element={<AdminPage><EditarAlquiler /></AdminPage>} />

             </Routes>
             </ProtectedRoute>

             
  );
}
