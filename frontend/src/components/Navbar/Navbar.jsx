import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import logoImg from '../../assets/logo.png'; 

function Navbar({ cartCount }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); 

  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400); 
    }
  }, [cartCount]);

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-2 py-lg-3 glass-navbar shadow-sm mx-2 mx-lg-4 mt-2 mt-lg-3 px-3 px-lg-4" style={{ top: '12px', zIndex: 1030 }}>
      <div className="container-fluid px-0 d-flex align-items-center justify-content-between flex-nowrap">
        
        {/* DESKTOP BRAND LOGO (Otomatis Hilang di Layar HP) */}
        <Link className="navbar-brand fw-bolder text-brand fs-4 d-none d-lg-flex align-items-center me-0" to="/">
          <img src={logoImg} alt="AmbaCart Logo" height="34" className="me-2" />
          AmbaCart
        </Link>
        
        {/* KOLOM PENCARIAN (Responsif: Melebar Penuh Mengisi Sisi Kiri di HP) */}
        <div className="flex-grow-1 mx-0 mx-lg-4" style={{ maxWidth: '580px' }}>
          <form className="w-100">
            <div className="input-group search-bar-container shadow-sm">
              <span className="input-group-text bg-white border-0 ps-3 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </span>
              <input 
                className="form-control border-0 py-2 shadow-none ps-2 bg-white small" 
                type="search" 
                placeholder="Cari di AmbaCart..." 
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </form>
        </div>

        {/* GRUP MENU AKSI SISI KANAN */}
        <div className="d-flex align-items-center gap-1 gap-sm-2 ms-2 ms-lg-0">
          
          {/* 🛒 IKON KERANJANG MINI SOLID (Hanya Muncul di HP) */}
          <button className="btn p-2 text-dark position-relative d-inline-block d-lg-none bg-transparent border-0 shadow-none" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-cart-fill text-dark ${isAnimating ? 'animate-pop' : ''}`} viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            {cartCount > 0 && (
              <span className="position-absolute top-1 start-75 translate-middle badge rounded-circle bg-danger p-1 d-flex align-items-center justify-content-center" style={{ fontSize: '0.65rem', minWidth: '16px', height: '16px' }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* 🍔 MENU HAMBURGER KUSTOM DENGAN ANIMASI TRANSISI (Hanya Muncul di HP) */}
          <button 
            className={`custom-hamburger-btn d-lg-none ${isNavOpen ? 'open' : ''}`} 
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          {/* TAMPILAN STRUKTUR ASLI UNTUK DESKTOP / LAPTOP */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link className="btn btn-login-nav fw-bold px-4 py-2" to="/login">
              Login
            </Link>
            <button className="btn flat-btn-brand d-flex align-items-center justify-content-center gap-2 px-4 py-2.5 rounded-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isAnimating ? 'animate-pop' : ''} viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              <span className="fw-bold">Keranjang</span>
              {cartCount > 0 && (
                <span className="badge bg-white text-brand ms-1 rounded-pill px-2 py-1 shadow-sm">{cartCount}</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* PANEL DROPDOWN PUDAR HALUS (SLIDEDOWN) KHUSUS DI HP SAAT HAMBURGER DIKLIK */}
      <div className={`mobile-nav-menu d-lg-none ${isNavOpen ? 'show' : ''}`}>
        <div className="py-3 px-2 text-center border-top mt-2">
          <Link className="btn btn-login-nav w-100 py-2.5 fw-bold rounded-3 shadow-sm" to="/login" onClick={() => setIsNavOpen(false)}>
            Login ke Akun Anda
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;