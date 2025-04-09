import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import { ClientPage } from '../layouts/ClientPage'

export const ClientRoutes = () => {
  return (
    <Router>
    <Routes>
      <Route path="/admin" element={<ClientPage></ClientPage>} />
      <Route path="/" element={<ClientPage></ClientPage>} />
    </Routes>
  </Router>  
  )
}
