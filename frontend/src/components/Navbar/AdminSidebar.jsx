import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import http from '../../utils/http';
import logoImg from '../../assets/logo.png';

function AdminSidebar({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const brandColor = '#03AC0E';

  const syncNotifs = async () => {
    try {
      const res = await http.get('/notifications/unread');
      if(res.data.success) setUnreadNotifs(res.data.count);
    } catch (e) { }
  };

  useEffect(() => {
    syncNotifs();
    // FIXED: Dipercepat menjadi 1.5 detik agar notifikasi Admin terasa sangat instan!
    const interval = setInterval(syncNotifs, 1500); 
    window.addEventListener('notifUpdate', syncNotifs);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notifUpdate', syncNotifs);
    }
  }, []);

  const executeLogout = () => {
    logout();
    if (showToast) showToast("Berhasil Logout dari sesi admin.");
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'M2 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm8 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4zm-8 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z' },
    { path: '/admin/orders', label: 'Pesanan Masuk', icon: 'M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z' },
    { path: '/admin/add', label: 'Tambah Produk', icon: 'M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' },
    { path: '/admin/categories', label: 'Kelola Kategori', icon: 'M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z' },
    { path: '/admin/reports', label: 'Laporan Penjualan', icon: 'M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z' },
    { path: '/admin/withdraw', label: 'Penarikan Saldo', icon: 'M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z' }
  ];

  return (
    <>
      <style>{`
        @media (min-width: 992px) { body { padding-left: 280px; background-color: #f4f7f8; } .mobile-topbar { display: none !important; } }
        .admin-sidebar { width: 280px; height: 100vh; position: fixed; top: 0; left: 0; background: #ffffff; z-index: 1040; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-right: 1px solid #eef2f5; overflow-y: auto; display: flex; flex-direction: column; }
        .nav-item-custom { display: flex; align-items: center; padding: 14px 20px; margin: 6px 16px; border-radius: 14px; color: #64748b; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
        .nav-item-custom:hover { background-color: #f8fafc; color: ${brandColor}; transform: translateX(4px); }
        .nav-item-active { display: flex; align-items: center; padding: 14px 20px; margin: 6px 16px; border-radius: 14px; background: linear-gradient(135deg, ${brandColor}15 0%, ${brandColor}05 100%); color: ${brandColor}; text-decoration: none; font-weight: 800; border-left: 4px solid ${brandColor}; }
        @media (max-width: 991.98px) { .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } }
      `}</style>

      <div className="mobile-topbar bg-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top border-bottom" style={{ zIndex: 1030 }}>
        <div className="d-flex align-items-center fw-bolder fs-5" style={{ color: brandColor }}>
          <img src={logoImg} alt="Logo" height="28" className="me-2" /> Seller Centre
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="btn btn-light border-0 shadow-sm p-2 rounded-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={brandColor} viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1z"/></svg>
        </button>
      </div>
      {isMobileOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" style={{ zIndex: 1035 }} onClick={() => setIsMobileOpen(false)}></div>}

      <aside className={`admin-sidebar shadow-sm ${isMobileOpen ? 'open' : ''}`}>
        <div className="p-4 d-flex align-items-center justify-content-between border-bottom mb-2">
          <Link to="/admin" className="fw-black fs-4 text-decoration-none d-flex align-items-center" style={{ color: brandColor }}>
            <img src={logoImg} alt="Logo" height="34" className="me-2 drop-shadow" /> Seller Centre
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="btn-close d-lg-none"></button>
        </div>

        <div className="flex-grow-1 overflow-auto hide-scrollbar pt-2">
          <div className="px-4 pb-2 text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Menu Utama</div>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={idx} to={item.path} onClick={() => setIsMobileOpen(false)} className={isActive ? 'nav-item-active' : 'nav-item-custom'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-3" viewBox="0 0 16 16"><path fillRule="evenodd" d={item.icon}/></svg>{item.label}
              </Link>
            );
          })}
          
          <div className="px-4 pb-2 mt-4 text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Pusat Bantuan</div>
          
          <Link to="/admin/chat-list" onClick={() => setIsMobileOpen(false)} className={location.pathname === '/admin/chat-list' ? 'nav-item-active' : 'nav-item-custom'}>
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-3" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592"/></svg>
             Pesan Chat
          </Link>

          <Link to="/admin/notifications" onClick={() => setIsMobileOpen(false)} className={location.pathname === '/admin/notifications' ? 'nav-item-active' : 'nav-item-custom d-flex justify-content-between align-items-center'}>
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-3" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg> Notifikasi
            </div>
            {unreadNotifs > 0 && <span className="badge bg-danger rounded-pill px-2">{unreadNotifs}</span>}
          </Link>
        </div>

        <div className="p-4 border-top mt-auto bg-light">
          <Link to="/" className="btn btn-outline-success fw-bold w-100 py-2 mb-3 rounded-pill bg-white d-flex justify-content-center align-items-center shadow-sm hover-scale">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/><path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/></svg>
            Kembali ke Etalase
          </Link>

          <div className="d-flex align-items-center mb-3">
            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm" style={{width:'40px', height:'40px'}}>AD</div>
            <div>
              <h6 className="fw-bold mb-0 text-dark">Admin Toko</h6>
              <span className="small text-success fw-bold">● Online</span>
            </div>
          </div>
          <button onClick={() => setShowLogoutModal(true)} className="btn btn-danger fw-bold w-100 py-2.5 rounded-3 shadow-sm hover-scale d-flex justify-content-center align-items-center">Keluar Sesi (Logout)</button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-danger d-flex justify-content-center"><div className="bg-danger bg-opacity-10 p-3 rounded-circle"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L10.5 10.793V1.5a.5.5 0 0 0-1 0v9.293l-2.146-2.147a.5.5 0 0 0-.708 0z"/></svg></div></div>
            <h4 className="fw-black text-dark mb-2">Keluar Sesi?</h4>
            <p className="text-secondary small mb-4 px-2">Anda akan mengakhiri sesi Admin AmbaCart. Anda perlu login kembali untuk mengelola produk.</p>
            <div className="d-flex gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-light text-secondary fw-bold w-50 py-2.5 rounded-pill border hover-scale">Batal</button>
              <button onClick={executeLogout} className="btn btn-danger text-white fw-bold w-50 py-2.5 rounded-pill shadow-sm hover-scale">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;