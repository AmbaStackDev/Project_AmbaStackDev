import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { AuthContext } from '../context/AuthContext'; 
import AuthAlertModal from '../components/Modal/AuthAlertModal';

function MainLayout() {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('amba_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartCount, setCartCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, type: 'error', title: '', message: '', onConfirm: null });

  // FIXED: Memaksa MainLayout untuk menyadari jika keranjang dihapus oleh Checkout atau diubah dari dalam Cart
  useEffect(() => {
    const syncCart = () => {
      const savedCart = localStorage.getItem('amba_cart');
      setCart(savedCart ? JSON.parse(savedCart) : []);
    };
    window.addEventListener('cartChanged', syncCart);
    return () => window.removeEventListener('cartChanged', syncCart);
  }, []);

  useEffect(() => {
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(totalItems);
    localStorage.setItem('amba_cart', JSON.stringify(cart));
  }, [cart]);

  // FIXED: Logika Tambah Keranjang dengan Pengecekan Batas Stok
  const handleAddToCart = (product, requestedQty = 1) => {
    if (!token) {
      setAlertModal({
        show: true, type: 'error', title: 'Akses Dibatasi',
        message: 'Oops! Silakan Login terlebih dahulu untuk memasukkan barang ke keranjang belanja Anda.',
        onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); navigate('/login'); }
      });
      return;
    }
    
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        const currentQty = prevCart[existingItemIndex].quantity || 1;
        const newQty = currentQty + requestedQty;
        
        if (newQty > product.stock) {
          setAlertModal({
            show: true, type: 'error', title: 'Stok Terbatas',
            message: `Kamu tidak bisa menambah barang ini lagi. Stok maksimal di toko hanya ${product.stock} buah.`,
            onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
          });
          return prevCart; // Batalkan penambahan jika melebihi stok
        }

        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity = newQty;
        return newCart;
      } else {
        if (requestedQty > product.stock) requestedQty = product.stock;
        return [...prevCart, { ...product, quantity: requestedQty }];
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ background: '#f8f9fa' }}>
      <Navbar cartCount={cartCount} />
      <main className="container-fluid flex-grow-1 px-2 px-md-5 mt-4">
        <Outlet context={{ handleAddToCart }} /> 
      </main>
      <Footer />
      
      {/* RENDER MODAL ALERT UNIVERSAL */}
      <AuthAlertModal show={alertModal.show} type={alertModal.type} title={alertModal.title} message={alertModal.message} onClose={alertModal.onConfirm} />
      
      <button onClick={scrollToTop} className="btn shadow-lg text-white" style={{ position: 'fixed', bottom: '30px', right: '30px', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#03AC0E', zIndex: 2000, display: showScrollTop ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease-in-out', border: 'none' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>
      </button>
    </div>
  );
}

export default MainLayout;