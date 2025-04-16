import React from 'react'
import AdminMenu from '../components/admin/Menu'

interface AdminPageProps {
  children?: React.ReactNode;
}

export const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
  return (
    <div className="d-flex">
      <AdminMenu />
      <main style={{
        marginLeft: "250px", // Match the menu width
        width: "calc(100% - 250px)", // Take remaining space
        padding: "20px",
        minHeight: "100vh" // Full viewport height
      }}>
        {children}
      </main>
    </div>
  )
}