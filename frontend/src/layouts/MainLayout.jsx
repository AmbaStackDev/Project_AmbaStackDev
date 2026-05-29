import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

function MainLayout({ cartCount, handleAddToCart }) {
  // STATE UNTUK MENAMPILKAN/MENYEMBUNYIKAN TOMBOL
  const [showScrollTop, setShowScrollTop] = useState(false);

  // DETEKSI SCROLL PENGGUNA
  useEffect(() => {
    const handleScroll = () => {
      // Jika pengguna scroll lebih dari 300px ke bawah, tombol akan muncul
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Membersihkan event listener ketika komponen tidak dipakai
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FUNGSI UNTUK MELUNCUR KE ATAS DENGAN MULUS
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Membuat efek meluncur, bukan lompat kaku
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar cartCount={cartCount} />
      
      <main className="container-fluid flex-grow-1 px-2 px-md-5 mt-4">
        <Outlet context={{ handleAddToCart }} /> 
      </main>
      
      <Footer />

      {/* ==========================================
          TOMBOL MENGAMBANG "SCROLL TO TOP"
          ========================================== */}
      <button
        onClick={scrollToTop}
        className={`btn rounded-circle shadow-lg d-flex align-items-center justify-content-center scroll-to-top-btn ${showScrollTop ? 'show' : ''}`}
        aria-label="Scroll to top"
      >
        {/* Ikon Panah ke Atas Solid SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </button>
    </div>
  );
}

export default MainLayout;