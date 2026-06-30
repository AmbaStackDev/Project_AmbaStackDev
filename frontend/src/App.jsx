import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Profile from './pages/Profile';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';
import AdminOrders from './pages/Admin/AdminOrders';
import OrderHistory from './pages/OrderHistory';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminReports from './pages/Admin/AdminReports';
import AdminWithdraw from './pages/Admin/AdminWithdraw';

import Notifications from './pages/Notifications';
import ChatList from './pages/ChatList';
import Chat from './pages/Chat';

import CaraBelanja from './pages/CaraBelanja';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          
          {/* RUTE PEMBELI BARU */}
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/chat-list" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          <Route path="/cara-belanja" element={<CaraBelanja />} />
          <Route path="/hubungi-kami" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
        
        {/* RUTE ADMIN BARU */}
        <Route path="/admin/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/admin/chat-list" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/admin/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/admin/withdraw" element={<ProtectedRoute><AdminWithdraw /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;