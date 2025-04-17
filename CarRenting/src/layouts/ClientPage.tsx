import React from 'react';
import Footer from '../components/www/Footer';
import { Header } from '../components/www/Header';
import "../index.css"
interface ClientPageProps {
  children?: React.ReactNode; // Permite recibir `children` como prop
}

export const ClientPage: React.FC<ClientPageProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">{children}</main> {/* Renderiza contenido dinámico aquí */}
      <Footer />
    </>
  );
};
