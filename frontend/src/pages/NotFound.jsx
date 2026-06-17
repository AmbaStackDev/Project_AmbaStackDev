import React from 'react';
import { useNavigate } from 'react-router-dom';
import mascotImg from '../assets/mascot3.png'; 

function NotFound() {
  const navigate = useNavigate();
  const brandColor = '#03AC0E';

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e0eafc 100%)', padding: '20px' }}>
      
      {/* KARTU 404 SELARAS DENGAN LOGIN & REGISTER */}
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white position-relative text-center" style={{ width: '100%', maxWidth: '400px', margin: '80px auto 20px auto', overflow: 'visible' }}>
        
        {/* MASKOT NONGOL (POP-OUT EFFECT) */}
        <div className="text-center mb-2 position-relative" style={{ marginTop: '-130px', zIndex: 10 }}>
          <img 
            src={mascotImg} 
            alt="Mascot 404" 
            className="img-fluid" 
            style={{ 
              maxWidth: '180px', 
              filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.15))',
              transform: 'scale(1.05) rotate(-2deg)',
              marginBottom: '-20px'
            }} 
          />
        </div>

        {/* Angka Error Raksasa */}
        <h1 className="fw-black text-dark mb-1 mt-2" style={{ fontSize: '4rem', letterSpacing: '-1px', lineHeight: '1' }}>
          404
        </h1>
        
        <h4 className="fw-bold text-dark mb-2">Halaman Tidak Ditemukan</h4>
        
        <p className="text-secondary small mb-4 px-2 lh-base fw-medium">
          Waduh! Sepertinya rute jalan yang Anda tuju salah atau halaman etalase AmbaCart ini sudah dipindahkan.
        </p>

        {/* Tombol Aksi Kembali ke Beranda */}
        <button 
          onClick={() => navigate('/')} 
          className="btn w-100 text-white fw-bold py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
          style={{ background: brandColor, transition: 'all 0.2s ease-in-out', border: 'none' }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#028a0a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Kembali ke Beranda
        </button>

      </div>
    </div>
  );
}

export default NotFound;