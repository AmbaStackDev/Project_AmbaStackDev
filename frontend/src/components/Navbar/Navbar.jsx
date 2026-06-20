import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import AuthAlertModal from '../Modal/AuthAlertModal'; 
import './Navbar.css'; 
import logoImg from '../../assets/logo.png'; 

function Navbar({ cartCount }) {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  // State untuk Modal Alert Universal
  const [alertModal, setAlertModal] = useState({
    show: false, type: 'error', title: '', message: '', onConfirm: null
  });

  // Dekode Token
  let userName = '';
  let userRole = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userName = payload.name || payload.email.split('@')[0];
      userRole = payload.role; 
    } catch (e) {}
  }

  // Efek Animasi Denyut pada Ikon Keranjang
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400); 
    }
  }, [cartCount]);

  // Fungsi Penjaga Gerbang Seller Centre
  const handleSellerClick = () => {
    if (!token) {
      setAlertModal({
        show: true, type: 'error', title: 'Akses Dibatasi',
        message: 'Silakan Login terlebih dahulu untuk mengakses sistem Seller Centre AmbaCart.',
        onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); navigate('/login'); }
      });
    } else if (userRole !== 'admin') {
      setAlertModal({
        show: true, type: 'error', title: 'Akses Ditolak',
        message: 'Akun Anda saat ini terdaftar sebagai Pembeli. Hanya Penjual/Admin yang dapat mengakses Dasbor ini.',
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
    } else {
      navigate('/admin');
    }
  };

  const handleCartClick = () => {
    if (!token) {
      setAlertModal({
        show: true, type: 'error', title: 'Akses Dibatasi',
        message: 'Silakan Login sebagai pembeli terlebih dahulu untuk melihat isi keranjang.',
        onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); navigate('/login'); }
      });
    } else {
      setAlertModal({
        show: true, type: 'success', title: 'Segera Hadir!',
        message: 'Halaman keranjang sedang dalam proses pengembangan untuk Sprint 14.',
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
    }
  };

  const showSprint14Alert = (featureName) => {
    setAlertModal({
      show: true, type: 'success', title: 'Segera Hadir!',
      message: `Fitur ${featureName} akan diaktifkan pada penyelesaian Sprint 14.`,
      onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top py-2 py-lg-3 glass-navbar shadow-sm mx-2 mx-lg-4 mt-2 mt-lg-3 px-3 px-lg-4" style={{ top: '12px', zIndex: 1030 }}>
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between flex-nowrap">
          
          {/* BAGIAN KIRI: BRAND & SELLER CENTRE */}
          <div className="d-flex align-items-center gap-3">
            <Link className="navbar-brand fw-bolder fs-4 d-flex align-items-center m-0 hover-scale" to="/" style={{ color: '#03AC0E', textDecoration: 'none', transition: 'all 0.2s' }}>
              <img src={logoImg} alt="AmbaCart Logo" height="34" className="me-2" />
              <span className="d-none d-sm-inline">AmbaCart</span>
            </Link>
            
            <div style={{ height: '24px', width: '2px', backgroundColor: '#e2e8f0' }} className="d-none d-md-block"></div>
            
            <button onClick={handleSellerClick} className="btn btn-sm text-secondary fw-bold hover-text-brand d-none d-md-block" style={{ border: 'none', background: 'transparent' }}>
              Seller Centre
            </button>
          </div>
          
          {/* BAGIAN KANAN: TOOLS & PROFIL */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            
            

            {token ? (
              <>
                {/* 2. IKON NOTIFIKASI & PESANAN SOLID */}
                <div className="d-flex align-items-center gap-2 d-none d-md-flex">
                  
                   {/* 3. GRUP PROFIL */}
                  <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')} title="Profil Saya">
                    
                    <span className="text-secondary fw-bold small d-none d-lg-block text-truncate hover-text-brand" style={{ maxWidth: '120px' }}>
                      Hi, {userName}!
                    </span>
                    <div className="btn btn-light rounded-circle p-0 shadow-sm overflow-hidden d-flex hover-scale" style={{ width: '40px', height: '40px', border: '2px solid #03AC0E' }}>
                      <img src={`https://ui-avatars.com/api/?name=${userName}&background=f0fdf4&color=03AC0E&bold=true`} alt="Profile" className="w-100 h-100" />
                    </div>
                  </div>
                  
                  <div style={{ height: '24px', width: '2px', backgroundColor: '#e2e8f0' }} className="d-none d-md-block mx-1"></div>

                  <button onClick={() => showSprint14Alert('Notifikasi')} className="btn btn-light rounded-circle p-2 shadow-sm position-relative text-secondary hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }} title="Notifikasi">
                    {/* Ikon Bell Solid */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                  </button>

                  <button onClick={() => showSprint14Alert('Riwayat Pesanan')} className="btn btn-light rounded-circle p-2 shadow-sm text-secondary hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }} title="Pesanan Saya">
                    {/* Ikon Bag Solid */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                    </svg>
                  </button>

                  {/* 1. IKON KERANJANG SOLID (Tanpa Teks) */}
                  <button onClick={handleCartClick} className="btn rounded-circle p-2 shadow-sm position-relative text-white hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#03AC0E', border: 'none', transition: 'transform 0.2s' }} title="Keranjang">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isAnimating ? 'pulse-animation' : ''} viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.65rem', padding: '0.35em 0.55em', borderWidth: '2px' }}>
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                </div>

                

               
              </>
            ) : (
              <Link className="btn fw-bold px-4 py-2 d-none d-sm-block hover-scale" to="/login" style={{ borderColor: '#03AC0E', color: '#03AC0E', borderRadius: '10px', borderWidth: '1.5px', transition: 'transform 0.2s' }}>
                Masuk / Daftar
              </Link>
            )}

          </div>
        </div>
      </nav>

      {/* RENDER MODAL ALERT UNIVERSAL */}
      <AuthAlertModal 
        show={alertModal.show} 
        type={alertModal.type} 
        title={alertModal.title} 
        message={alertModal.message} 
        onClose={alertModal.onConfirm} 
      />
    </>
  );
}

export default Navbar;