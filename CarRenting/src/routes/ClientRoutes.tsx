import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ClientPage } from '../layouts/ClientPage';
import { Index } from '../pages/www/Site';

export const ClientRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientPage><Index /></ClientPage>} />
      </Routes>
    </Router>
  );
};

