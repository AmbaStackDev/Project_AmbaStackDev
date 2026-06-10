import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ambaNormal from '../../assets/mascot1.png'; 
import ambaClosed from '../../assets/mascot2.png'; 

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass-panel p-5 shadow-lg position-relative mt-5" style={{ width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
      
      {/* TOMBOL KEMBALI MENUJU BERANDA */}
      <button 
        type="button" 
        onClick={() => navigate('/')} 
        className="btn btn-light text-secondary rounded-circle shadow-sm d-flex align-items-center justify-content-center position-absolute hover-scale" 
        style={{ 
          top: '24px', 
          left: '24px', 
          width: '38px', 
          height: '38px', 
          zIndex: 10, 
          transition: 'transform 0.2s',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
        title="Kembali ke Beranda"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>

      {/* MASKOT */}
      <div 
        className="text-center" 
        style={{ 
          marginTop: '-130px', 
          marginBottom: '5px', 
          display: 'grid', 
          placeItems: 'center', 
          height: '185px'
        }}
      >
        <img 
          src={ambaNormal} 
          alt="AmbaCart Ambassador" 
          style={{ 
            gridArea: '1 / 1 / 2 / 2',
            height: '185px', 
            objectFit: 'contain', 
            transition: 'opacity 0.15s ease-in-out',
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))',
            opacity: showPassword ? 0 : 1,
            zIndex: showPassword ? 1 : 2
          }} 
        />
        <img 
          src={ambaClosed} 
          alt="AmbaCart Ambassador Eyes Closed" 
          style={{ 
            gridArea: '1 / 1 / 2 / 2',
            height: '185px', 
            objectFit: 'contain', 
            transition: 'opacity 0.15s ease-in-out',
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))',
            opacity: showPassword ? 1 : 0,
            zIndex: showPassword ? 2 : 1
          }} 
        />
      </div>

      <h4 className="fw-bold text-center text-dark mb-1 mt-2">Daftar Akun Baru</h4>
      <p className="text-center text-secondary mb-4 small">Bergabunglah dengan ekosistem AmbaCart</p>
      
      <form>
        {/* INPUT NAMA LENGKAP DENGAN ICON ORANG */}
        <div className="mb-3">
          <label className="form-label fw-medium text-dark small">Nama Lengkap</label>
          <div className="input-group custom-input-group shadow-sm bg-white rounded-3 overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-secondary ps-3 pe-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </span>
            <input type="text" className="form-control px-2 py-2 border-0 shadow-none bg-transparent" placeholder="Nama Lengkap Anda" required />
          </div>
        </div>
        
        {/* INPUT EMAIL DENGAN ICON */}
        <div className="mb-3">
          <label className="form-label fw-medium text-dark small">Email</label>
          <div className="input-group custom-input-group shadow-sm bg-white rounded-3 overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-secondary ps-3 pe-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
              </svg>
            </span>
            <input type="email" className="form-control px-2 py-2 border-0 shadow-none bg-transparent" placeholder="contoh@email.com" required />
          </div>
        </div>
        
        {/* INPUT PASSWORD DENGAN ICON KIRI & KANAN */}
        <div className="mb-4">
          <label className="form-label fw-medium text-dark small">Password</label>
          <div className="input-group custom-input-group shadow-sm bg-white rounded-3 overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-secondary ps-3 pe-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
              </svg>
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control px-2 py-2 border-0 shadow-none bg-transparent" 
              placeholder="Minimal 8 karakter" 
              required 
            />
            <button 
              type="button" 
              className="btn btn-eye border-0 text-secondary bg-transparent px-3 d-flex align-items-center" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ zIndex: 5 }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474L3.086 5.212C1.612 6.397.737 7.712.735 7.715a.5.5 0 0 0 0 .57c.163.26 1.385 2.15 3.426 3.728 2.04 1.579 4.417 2.42 6.629 2.42a11.4 11.4 0 0 0 1.004-.05C10.79 12.912 10.79 12.912 10.79 12.912M9.986 9.57l-1.12-1.119c.1-.137.145-.296.145-.451a1.5 1.5 0 0 0-1.5-1.5c-.156 0-.315.045-.451.145L5.943 5.529a3.5 3.5 0 0 1 4.043 4.043m.254 1.4-1.51-1.512A1.5 1.5 0 0 0 7.93 7.93l-1.512-1.51A1.5 1.5 0 0 0 5.07 9.34l1.51 1.512A1.5 1.5 0 0 0 9.34 9.34l1.512 1.51a1.5 1.5 0 0 0 1.132-.213"/>
                  <path d="M14.265 11.182c1.474-1.183 2.348-2.498 2.35-2.5a.5.5 0 0 0 0-.57C16.452 7.852 15.23 5.96 13.19 4.383 11.15 2.804 8.773 1.96 6.561 1.96c-.34 0-.676.02-1.003.058L3.92 4.4l-1.31-1.31A1 1 0 0 0 1.196 4.5l11.45 11.45a1 1 0 0 0 1.41-1.41l-1.04-1.04-.325-.325zM11.77 10.42 10.35 9a1.5 1.5 0 0 0-1.42-1.42L7.5 6.16a3.5 3.5 0 0 1 4.27 4.27z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="btn flat-btn-brand w-100 py-2.5 fw-bold mb-3 rounded-3">
          Buat Akun
        </button>
      </form>
      
      <div className="text-center mt-4">
        <p className="small text-secondary mb-0">
          Sudah punya akun? <Link to="/login" className="fw-bold text-brand text-decoration-none">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;