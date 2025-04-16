import React from 'react';
import Footer from '../components/www/Footer';
import { Header } from '../components/www/Header';

interface ClientPageProps {
  children?: React.ReactNode; // Permite recibir `children` como prop
}

export const ClientPage: React.FC<ClientPageProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main> {/* Renderiza contenido dinámico aquí */}
      <Footer />
    </>
  );
};
