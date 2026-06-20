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

  const isDashboard = location.pathname === '/admin';
  const isAddProduct = location.pathname === '/admin/add';

  return (
    <>
      <style>{`
        .nav-link-custom { color: #6c757d; text-decoration: none; font-weight: 600; transition: color 0.2s; padding: 8px 12px; border: none; background: transparent; }
        .nav-link-custom:hover { color: ${brandColor}; background-color: transparent; }
        .nav-link-active { color: ${brandColor}; text-decoration: none; font-weight: 700; border-bottom: 2px solid ${brandColor}; padding: 8px 12px; }
      `}</style>

      <nav className="navbar navbar-expand-lg sticky-top py-3 bg-white border-bottom shadow-sm" style={{ zIndex: 1030 }}>
        <div className="container px-3 px-md-4">
          <Link className="navbar-brand fw-bolder fs-4 d-flex align-items-center m-0" to="/admin" style={{ color: brandColor, textDecoration: 'none' }}>
            <img src={logoImg} alt="AmbaCart Logo" height="34" className="me-2" />
            Seller Centre
          </Link>

          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse mt-3 mt-lg-0" id="adminNavbarContent">
            <div className="navbar-nav mx-auto gap-1 gap-lg-3">
              <Link to="/admin" className={isDashboard ? "nav-link-active" : "nav-link-custom"}>
                Dashboard
              </Link>
              <Link to="/admin/add" className={isAddProduct ? "nav-link-active" : "nav-link-custom"}>
                Tambah Produk
              </Link>
              <button onClick={() => alert("Fitur Laporan Penjualan (Sprint 14)")} className="nav-link-custom text-start">
                Laporan Penjualan
              </button>
            </div>

            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 border-top border-lg-0 pt-3 pt-lg-0">
              {/* FIXED: Tombol untuk melompat kembali ke halaman utama / etalase */}
              <Link to="/" className="btn btn-light fw-bold px-3 py-2 shadow-sm text-secondary hover-text-brand border" style={{ borderRadius: '10px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                </svg>
                Lihat Etalase
              </Link>

              <button onClick={() => setShowLogoutModal(true)} className="btn btn-danger fw-bold px-3 py-2 shadow-sm" style={{ borderRadius: '10px' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-danger d-flex justify-content-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L10.5 10.793V1.5a.5.5 0 0 0-1 0v9.293l-2.146-2.147a.5.5 0 0 0-.708 0z"/>
                </svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Keluar Sesi?</h4>
            <p className="text-secondary small mb-4 px-2">Anda akan mengakhiri sesi Admin AmbaCart. Anda perlu login kembali untuk mengelola produk.</p>
            <div className="d-flex gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-light text-secondary fw-bold w-50 py-2.5 rounded-pill border">Batal</button>
              <button onClick={executeLogout} className="btn btn-danger text-white fw-bold w-50 py-2.5 rounded-pill shadow-sm">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminNavbar;