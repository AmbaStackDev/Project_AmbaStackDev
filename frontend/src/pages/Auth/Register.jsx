import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="glass-panel p-5 shadow-lg" style={{ width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
      <h4 className="fw-bold text-center text-dark mb-1">Daftar Akun Baru</h4>
      <p className="text-center text-secondary mb-4 small">Bergabunglah dengan ekosistem AmbaCart</p>
      <form>
        <div className="mb-3">
          <label className="form-label fw-medium text-dark small">Nama Lengkap</label>
          <input type="text" className="form-control px-3 py-2 border-0 shadow-sm" placeholder="Nama Lengkap Anda" required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium text-dark small">Email</label>
          <input type="email" className="form-control px-3 py-2 border-0 shadow-sm" placeholder="contoh@email.com" required />
        </div>
        <div className="mb-4">
          <label className="form-label fw-medium text-dark small">Password</label>
          <input type="password" className="form-control px-3 py-2 border-0 shadow-sm" placeholder="Minimal 6 karakter" required />
        </div>
        <button type="submit" className="btn flat-btn-brand w-100 py-2.5 fw-bold mb-3 rounded-3">
          Buat Akun
        </button>
      </form>
      <div className="text-center mt-3">
        <p className="small text-secondary mb-0">
          Sudah punya akun? <Link to="/login" className="fw-bold text-brand text-decoration-none">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;