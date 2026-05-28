import React from 'react';
import logoImg from '../../assets/logo.png'; // Jalur gambar disesuaikan

function Footer() {
  return (
    <footer className="glass-panel mx-3 mb-3 mt-5 pt-5 pb-3 px-4">
      <div className="container-fluid">
        <div className="row text-start">
          <div className="col-md-5 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img src={logoImg} alt="AmbaCart Logo" height="38" className="me-2" />
              <h4 className="fw-bold text-brand mb-0">AmbaCart</h4>
            </div>
            <p className="text-secondary small lh-lg fw-medium">
              AmbaCart adalah ekosistem smart marketplace yang dirancang untuk mendukung kelancaran transaksi retail produk orisinal multi-kategori secara aman, cepat, dan responsif.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold text-dark mb-3">Layanan Pengguna</h6>
            <ul className="list-unstyled text-secondary small lh-lg fw-medium">
              <li><a href="#" className="text-decoration-none text-secondary">Pusat Resolusi</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Panduan Pembayaran Aman</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Kebijakan Pengembalian Produk</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-dark mb-3">Keamanan & Layanan</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-white text-dark border px-3 py-2 rounded-1 d-flex align-items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                </svg>
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
        <hr className="my-4 text-secondary" />
        <div className="text-center small text-secondary fw-medium">
          &copy; 2026 Tim AmbaStackDev - Pemrograman Fullstack STT-NF
        </div>
      </div>
    </footer>
  );
}

export default Footer;