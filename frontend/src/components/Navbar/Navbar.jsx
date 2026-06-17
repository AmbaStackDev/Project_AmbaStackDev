import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import Global State Sprint 13
import './Navbar.css'; 
import logoImg from '../../assets/logo.png'; 

function Navbar({ cartCount }) {
  const { token, logout } = useContext(AuthContext); // Tarik data sesi user
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  // Animasi berdenyut saat produk ditambahkan
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400); 
    }
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Kembali ke beranda setelah logout
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-2 py-lg-3 glass-navbar shadow-sm mx-2 mx-lg-4 mt-2 mt-lg-3 px-3 px-lg-4" style={{ top: '12px', zIndex: 1030 }}>
      <div className="container-fluid px-0 d-flex align-items-center justify-content-between flex-nowrap">
        
        {/* LOGO & BRAND (Terkunci warna hijau) */}
        <Link className="navbar-brand fw-bolder fs-4 d-flex align-items-center" to="/" style={{ color: '#03AC0E', textDecoration: 'none' }}>
          <img src={logoImg} alt="AmbaCart Logo" height="34" className="me-2" />
          AmbaCart
        </Link>
        
        <div className="d-flex align-items-center gap-2 gap-md-3">
          
          {/* RENDER DINAMIS TOMBOL AUTH (SPRINT 13) */}
          {token ? (
            <>
              <Link className="btn fw-bold px-3 px-md-4 py-2 d-none d-sm-block" to="/admin" style={{ borderColor: '#03AC0E', color: '#03AC0E', borderRadius: '10px', borderWidth: '1.5px' }}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger fw-bold px-3 px-md-4 py-2 d-none d-sm-block" style={{ borderRadius: '10px', borderWidth: '1.5px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn fw-bold px-3 px-md-4 py-2 d-none d-sm-block" to="/login" style={{ borderColor: '#03AC0E', color: '#03AC0E', borderRadius: '10px', borderWidth: '1.5px' }}>
              Login
            </Link>
          )}
          
          {/* TOMBOL KERANJANG DENGAN BADGE MERAH */}
          <button className="btn position-relative d-flex align-items-center justify-content-center gap-2 px-3 px-md-4 py-2.5 rounded-3 shadow-sm text-white" style={{ backgroundColor: '#03AC0E', border: 'none' }}>
            {/* Ikon Keranjang */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isAnimating ? 'pulse-animation' : ''} viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <span className="fw-bold d-none d-sm-inline">Keranjang</span>

            {/* NOTIFICATION BADGE MERAH (Hanya muncul jika cartCount > 0) */}
            {cartCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" 
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.35em 0.6em', 
                  borderWidth: '2px' 
                }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;