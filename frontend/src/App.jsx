import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// IMPORT LAYOUTS (Penyelamat Struktur Layout)
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// IMPORT HALAMAN PUBLIK
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';

// IMPORT HALAMAN AUTH
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// IMPORT HALAMAN ADMIN
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* RUTE PUBLIK (Dibungkus MainLayout agar Keranjang & Detail Produk Aktif) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* RUTE AUTENTIKASI (Dibungkus AuthLayout agar CSS & Posisi Tidak Hancur) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* PROTEKSI RUTE ADMIN (Berdiri Sendiri Bersama AdminNavbar) */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedRoute><AddProduct /></ProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute><EditProduct /></ProtectedRoute>
        } />

        {/* RUTE NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;