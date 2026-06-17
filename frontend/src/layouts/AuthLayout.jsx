import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center" 
      style={{ 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e0eafc 100%)', 
        padding: '20px' 
      }}
    >
      <div className="w-100 position-relative" style={{ maxWidth: '450px' }}>
        {/* Konten Login & Register akan dimuat di dalam Outlet ini */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;