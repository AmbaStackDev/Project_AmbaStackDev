import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // 1. Jika belum login sama sekali, tendang ke halaman Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Baca KTP (Decode JWT Token) untuk melihat Jabatan (Role)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    
    // Cek apakah halaman yang sedang dituju adalah halaman Admin
    const isAdminRoute = location.pathname.startsWith('/admin');

    // 3. LOGIKA GEMBOK KEAMANAN (ANTI-HACKER)
    // Jika dia mencoba masuk rute /admin, TAPI jabatannya BUKAN 'admin', tendang ke Beranda!
    if (isAdminRoute && userRole !== 'admin') {
      console.warn("Akses Ditolak: Pembeli mencoba masuk ke halaman Admin!");
      return <Navigate to="/" replace />;
    }

  } catch (error) {
    // Jika token rusak atau korup, tendang ke login
    return <Navigate to="/login" replace />;
  }

  // Jika aman dan sah, silakan lewat!
  return children;
}

export default ProtectedRoute;