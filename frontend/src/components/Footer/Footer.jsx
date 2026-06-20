import React from 'react';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom
import logoImg from '../../assets/logo.png'; 

function Footer() {
  return (
    <footer className="glass-panel mx-1 mx-md-3 mb-2 mb-md-3 mt-5 pt-5 pb-4 px-3 px-md-5 text-center text-md-start" style={{ borderRadius: '24px' }}>
      
      {/* Tambahan CSS khusus untuk Link Footer */}
      <style>{`
        .footer-link {
          color: #6c757d; /* text-secondary default */
          text-decoration: none;
          transition: all 0.2s ease-in-out;
        }
        .footer-link:hover {
          color: #03AC0E; /* Hijau AmbaCart saat di-hover */
          transform: translateX(4px); /* Efek bergeser sedikit ke kanan */
          display: inline-block;
        }
      `}</style>

      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <img src={logoImg} alt="AmbaCart Logo" height="38" className="me-2" />
              <h4 className="fw-bold mb-0" style={{ color: '#03AC0E' }}>AmbaCart</h4>
            </div>
            <p className="text-secondary small lh-lg fw-medium px-2 px-md-0">
              AmbaCart adalah ekosistem smart marketplace yang dirancang untuk mendukung kelancaran transaksi retail produk orisinal multi-kategori secara aman, cepat, dan responsif.
            </p>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0 mt-2 mt-md-0">
            <h6 className="fw-bold text-dark mb-3">Layanan Pengguna</h6>
            <ul className="list-unstyled small d-flex flex-column gap-3 fw-medium">
              {/* Mengubah <li> biasa menjadi <Link> yang bisa diklik */}
              <li><Link to="/cara-belanja" className="footer-link">Cara Belanja</Link></li>
              <li><Link to="/hubungi-kami" className="footer-link">Hubungi Kami</Link></li>
              <li><Link to="/faq" className="footer-link">Bantuan & FAQ</Link></li>
            </ul>
          </div>

          <div className="col-md-4 mt-2 mt-md-0">
            <h6 className="fw-bold text-dark mb-3">Keamanan & Layanan</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <span className="badge bg-white text-dark border px-3 py-2 rounded-2 shadow-sm d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                </svg>
                Transaksi Aman 100%
              </span>
              
              <span className="badge bg-white border px-3 py-2 rounded-2 shadow-sm d-flex align-items-center gap-2" style={{ color: '#03AC0E', borderColor: '#03AC0E' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                  <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 6.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
                Garansi Retur 7 Hari
              </span>
            </div>
          </div>
        </div>
        
        <hr className="my-4 opacity-10" />
        <p className="text-center text-secondary small mb-0 fw-medium">
          &copy; {new Date().getFullYear()} AmbaCart. All rights reserved. Built by AmbaStackDev.
        </p>
      </div>
    </footer>
  );
}

export default Footer;