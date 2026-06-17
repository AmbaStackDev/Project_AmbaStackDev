import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

function MainLayout() {
  // STATE MANAJEMEN KERANJANG TERPUSAT UNTUK HALAMAN PUBLIK
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // DETEKSI SCROLL PENGGUNA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ background: '#f8f9fa' }}>
      {/* Navbar menerima hitungan counter secara dinamis */}
      <Navbar cartCount={cartCount} />
      
      <main className="container-fluid flex-grow-1 px-2 px-md-5 mt-4">
        {/* Mengoper fungsi handleAddToCart ke komponen anak seperti Home dan ProductDetail */}
        <Outlet context={{ handleAddToCart }} /> 
      </main>
      
      <Footer />

      {/* FIXED: Tombol meluncur ke atas yang bulat sempurna, kecil, dan presisi di kanan bawah */}
      <button
        onClick={scrollToTop}
        className="btn shadow-lg text-white"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          backgroundColor: '#03AC0E',
          zIndex: 2000,
          display: showScrollTop ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease-in-out',
          border: 'none'
        }}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </button>
    </div>
  );
}

export default MainLayout;