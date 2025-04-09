import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminMenu = () => {
  return (
    <nav
      className="navbar navbar-dark bg-dark position-fixed h-100 d-flex flex-column flex-shrink-0 p-3"
      style={{ width: "250px" }}
    >
      <Link className="navbar-brand text-white mb-4 d-flex align-items-center" to="#">
        <i className="bi bi-speedometer2 me-2"></i> Panel de Administración
      </Link>
      <ul className="nav nav-pills flex-column w-100">
        <li className="nav-item">
          <Link className="nav-link text-white d-flex align-items-center" to="/admin">
            <i className="bi bi-house-door me-2"></i> Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white d-flex align-items-center" to="/admin/clientes">
            <i className="bi bi-people-fill me-2"></i> Clientes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white d-flex align-items-center" to="/admin/alquileres">
            <i className="bi bi-car-front me-2"></i> Alquileres
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white d-flex align-items-center" to="/admin/coches">
            <i className="bi bi-car-front-fill me-2"></i> Coches
          </Link>
        </li>
        <li className="nav-item">
          <button className="nav-link text-danger border-0 bg-transparent d-flex align-items-center w-100">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminMenu;
