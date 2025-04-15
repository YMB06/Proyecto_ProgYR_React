import React from 'react';
import Navbar from '../components/www/Menu';
import Footer from '../components/www/Footer';

interface ClientPageProps {
  children?: React.ReactNode; // Permite recibir `children` como prop
}

export const ClientPage: React.FC<ClientPageProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main> {/* Renderiza contenido dinámico aquí */}
      <Footer />
    </>
  );
};
