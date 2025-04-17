import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "../config/ProtectedRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { ClientRoutes } from "./ClientRoutes";

export const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminRoutes />
          </AdminRoute>
        } />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    );
  };