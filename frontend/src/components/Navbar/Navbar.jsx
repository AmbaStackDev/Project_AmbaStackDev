import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import AuthAlertModal from '../Modal/AuthAlertModal'; 
import http from '../../utils/http';
import './Navbar.css'; 
import logoImg from '../../assets/logo.png'; 

function Navbar({ cartCount }) {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const [alertModal, setAlertModal] = useState({
    show: false, type: 'error', title: '', message: '', onConfirm: null
  });

  let userName = '';
  let userRole = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userName = payload.name || payload.email.split('@')[0];
      userRole = payload.role; 
    } catch (e) {}
  }

  const syncNotifs = async () => {
    if (!token || userRole === 'admin') return; // Admin tidak perlu tarik notif pembeli
    try {
      const res = await http.get('/notifications/unread');
      if(res.data.success) setUnreadNotifs(res.data.count);
    } catch (e) { }
  };

  useEffect(() => {
    syncNotifs();
    const interval = setInterval(syncNotifs, 3000); 
    window.addEventListener('notifUpdate', syncNotifs); 
    return () => { clearInterval(interval); window.removeEventListener('notifUpdate', syncNotifs); };
  }, [token, userRole]);

  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400); 
    }
  }, [cartCount]);

  const handleSellerClick = () => {
    if (!token) {
      setAlertModal({ show: true, type: 'error', title: 'Akses Dibatasi', message: 'Silakan Login terlebih dahulu.', onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); navigate('/login'); }});
    } else if (userRole !== 'admin') {
      setAlertModal({ show: true, type: 'error', title: 'Akses Ditolak', message: 'Hanya Penjual/Admin yang dapat mengakses Dasbor ini.', onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))});
    } else { navigate('/admin'); }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top py-2 py-lg-3 glass-navbar shadow-sm mx-2 mx-lg-4 mt-2 mt-lg-3 px-3 px-lg-4" style={{ top: '12px', zIndex: 1030 }}>
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between flex-nowrap">
          <div className="d-flex align-items-center gap-3">
            <Link className="navbar-brand fw-bolder fs-4 d-flex align-items-center m-0 hover-scale" to="/" style={{ color: '#03AC0E', textDecoration: 'none', transition: 'all 0.2s' }}>
              <img src={logoImg} alt="AmbaCart Logo" height="34" className="me-2" />
              <span className="d-none d-sm-inline">AmbaCart</span>
            </Link>
            <div style={{ height: '24px', width: '2px', backgroundColor: '#e2e8f0' }} className="d-none d-md-block"></div>
            <button onClick={handleSellerClick} className="btn btn-sm text-secondary fw-bold hover-text-brand d-none d-md-block" style={{ border: 'none', background: 'transparent' }}>Seller Centre</button>
          </div>
          
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {token ? (
              <div className="d-flex align-items-center gap-2 d-none d-md-flex">
                <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')} title="Profil Saya">
                  <span className="text-secondary fw-bold small d-none d-lg-block text-truncate hover-text-brand" style={{ maxWidth: '120px' }}>Hi, {userName}!</span>
                  <div className="btn btn-light rounded-circle p-0 shadow-sm overflow-hidden d-flex hover-scale" style={{ width: '40px', height: '40px', border: '2px solid #03AC0E' }}><img src={`https://ui-avatars.com/api/?name=${userName}&background=f0fdf4&color=03AC0E&bold=true`} alt="Profile" className="w-100 h-100" /></div>
                </div>
                <div style={{ height: '24px', width: '2px', backgroundColor: '#e2e8f0' }} className="d-none d-md-block mx-1"></div>

                {/* HANYA TAMPIL JIKA BUKAN ADMIN */}
                {userRole !== 'admin' && (
                  <>
                    {/* TOMBOL CHAT PEMBELI */}
                    <Link to="/chat-list" className="btn btn-light rounded-circle p-2 shadow-sm text-secondary hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }} title="Pesan Chat">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592"/></svg>
                    </Link>

                    {/* TOMBOL NOTIFIKASI */}
                    <Link to="/notifications" className="btn btn-light position-relative p-2 rounded-circle hover-bg-brand border-0 hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }} title="Notifikasi">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                      </svg>
                      {unreadNotifs > 0 && <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ padding: '0.35rem' }}></span>}
                    </Link>
                  </>
                )}

                {/* TOMBOL ORDER HISTORY */}
                <Link to="/order-history" className="btn btn-light rounded-circle p-2 shadow-sm text-secondary hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }} title="Pesanan Saya">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/></svg>
                </Link>

                {/* TOMBOL KERANJANG */}
                <Link to="/cart" className="btn rounded-circle p-2 shadow-sm position-relative text-white hover-scale d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#03AC0E', border: 'none' }} title="Keranjang">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isAnimating ? 'pulse-animation' : ''} viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                  {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.65rem' }}>{cartCount}</span>}
                </Link>
              </div>
            ) : (
              <Link className="btn fw-bold px-4 py-2 d-none d-sm-block hover-scale" to="/login" style={{ borderColor: '#03AC0E', color: '#03AC0E', borderRadius: '10px', borderWidth: '1.5px' }}>Masuk / Daftar</Link>
            )}
          </div>
        </div>
      </nav>
      <AuthAlertModal show={alertModal.show} type={alertModal.type} title={alertModal.title} message={alertModal.message} onClose={alertModal.onConfirm} />
    </>
  );
}

export default Navbar;