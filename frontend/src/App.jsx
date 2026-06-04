import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Import Pages
import Home from './pages/Home'; 
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound'; 
import AddProduct from './pages/Admin/AddProduct';

import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    setToast({ show: true, message: 'Berhasil ditambahkan ke keranjang!' });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000); 
  };

  return (
    <>
      <Routes>
        <Route element={<MainLayout cartCount={cartCount} handleAddToCart={handleAddToCart} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin/add-product" element={<AddProduct />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast Notification */}
      <div className={`toast-notification ${toast.show ? 'show' : ''}`}>
        <div className="d-flex align-items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-success flex-shrink-0" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <span className="fw-bold text-dark small">{toast.message}</span>
        </div>
      </div>
    </>
  );
}

export default App;