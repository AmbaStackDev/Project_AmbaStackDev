import React from 'react';
import { useNavigate } from 'react-router-dom';

// IMPORT GAMBAR MASKOT 
import mascotImg from '../assets/mascot3.png'; 

function NotFound() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center" 
      style={{ 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e0eafc 100%)', 
        padding: '20px',
        paddingTop: '10px' // Tambahan ruang napas di atas agar maskot tidak terpotong
      }}
    >
      {/* Box Panel Kaca Utama (Glassmorphism) - Ditambah mt-5 dan position-relative */}
      <div 
        className="glass-panel p-5 shadow-lg d-flex flex-column align-items-center justify-content-center position-relative mt-5" 
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        
        {/* ==========================================
            GAMBAR MASKOT POPOUT (NONGOL DARI KARTU)
            ========================================== */}
        <div className="animate-pop text-center" style={{ marginTop: '-150px', marginBottom: '20px' }}>
          <img 
            src={mascotImg} 
            alt="Maskot AmbaCart Bingung" 
            style={{ 
              height: '230px', // Ukuran diperbesar (sebelumnya 200px)
              objectFit: 'contain',
              marginBottom: '-40px', // Sedikit tumpang tindih dengan angka 404
              filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.15))',
              transform: 'scale(1.05) rotate(-2deg)' // Sedikit dimiringkan agar lebih natural
            }} 
          />
        </div>

        {/* Angka Error Raksasa */}
        <h1 className="fw-black text-dark mb-2 mt-2" style={{ fontSize: '4rem', letterSpacing: '-1px', lineHeight: '1' }}>
          404
        </h1>
        
        <h4 className="fw-bold text-dark mb-2">Halaman Tidak Ditemukan</h4>
        
        <p className="text-secondary small mb-4 px-3 lh-base">
          Waduh! Sepertinya rute jalan yang Anda tuju salah atau halaman etalase AmbaCart ini sudah dipindahkan oleh tim developer kami.
        </p>

        {/* Tombol Aksi Kembali ke Beranda */}
        <button 
          onClick={() => navigate('/')} 
          className="btn flat-btn-brand w-100 py-2.5 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale"
          style={{ transition: 'all 0.2s ease-in-out' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          Kembali ke Beranda AmbaCart
        </button>
      </div>
    </div>
  );
}

export default NotFound;