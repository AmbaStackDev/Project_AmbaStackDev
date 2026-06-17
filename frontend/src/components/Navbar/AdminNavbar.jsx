import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

function AdminNavbar({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const brandColor = '#03AC0E';

  const executeLogout = () => {
    logout();
    if (showToast) showToast("Berhasil Logout dari sesi admin.");
    navigate('/login');
  };

  // Cek rute aktif untuk menentukan class styling warna hijau
  const isDashboard = location.pathname === '/admin';
  const isAddProduct = location.pathname === '/admin/add';

  return (
    <>
      <style>{`
        .nav-link-custom { color: #6c757d; text-decoration: none; font-weight: 600; transition: color 0.2s; padding: 8px 12px; border: none; background: transparent; }
        .nav-link-custom:hover { color: ${brandColor}; background-color: transparent; }
        .nav-link-active { color: ${brandColor}; text-decoration: none; font-weight: 700; border-bottom: 2px solid ${brandColor}; padding: 8px 0px; margin: 0 12px; }
      `}</style>

      <nav className="navbar sticky-top shadow-sm px-4 py-3 bg-white" style={{ zIndex: 1040 }}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link className="navbar-brand fw-bold d-flex align-items-center m-0" to="/admin" style={{ color: brandColor }}>
            <img src={logoImg} alt="Logo" height="30" className="me-2" />
            AmbaCart <span className="text-secondary fw-medium fs-6 ms-2 d-none d-sm-inline">| Admin</span>
          </Link>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <Link to="/admin" className={isDashboard ? "nav-link-active" : "nav-link-custom d-none d-md-block"}>
              Dashboard
            </Link>
            
            <Link to="/admin/add" className={isAddProduct ? "nav-link-active" : "btn btn-sm text-white fw-bold px-3 py-2 rounded-pill shadow-sm d-none d-md-flex align-items-center gap-1"} style={isAddProduct ? {} : { backgroundColor: brandColor, border: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Tambah Produk
            </Link>
            
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="btn btn-outline-danger btn-sm fw-bold px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 ms-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* POPUP MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-danger d-flex justify-content-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Ingin Logout?</h4>
            <p className="text-secondary small mb-4 px-2">Anda akan Logout dari sesi administrator. Anda harus login kembali untuk mengelola toko.</p>
            <div className="d-flex flex-column gap-2">
              <button onClick={executeLogout} className="btn btn-danger fw-bold w-100 py-2.5 rounded-pill shadow-sm">Ya, Logout Sekarang</button>
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-light fw-bold w-100 py-2.5 rounded-pill text-secondary border">Batal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminNavbar;