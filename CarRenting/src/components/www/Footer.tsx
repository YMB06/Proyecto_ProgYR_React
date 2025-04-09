import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start">
            <span>© 2024 YR Rent a Car</span>
          </div>
          <div className="col-md-4 text-center my-2 my-md-0">
            <Link to="/coches" className="text-white mx-2">
              Coches
            </Link>
            <Link to="/alquiler" className="text-white mx-2">
              Alquileres
            </Link>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <a href="#" className="text-white mx-1">
              <i className="bi bi-envelope"></i> infoyr@yrentacar.com
            </a>
            <a href="#" className="text-white mx-1">
              <i className="bi bi-telephone"></i> +34 664 70 72 83
            </a>
            <a href="#" className="text-white mx-1">
              <i className="bi bi-geo-alt"></i> C/Algo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
