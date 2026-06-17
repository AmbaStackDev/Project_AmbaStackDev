import React, { useState, useEffect } from 'react';
import './Hero.css'; 
import heroImg1 from '../../assets/ambassador.png'; 
import heroImg2 from '../../assets/ambassador2.png';
import heroImg3 from '../../assets/ambassador3.png';

function Hero() {
  const images = [heroImg1, heroImg2, heroImg3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="glass-panel mb-5 mt-4 position-relative shadow" style={{ borderRadius: '24px', overflow: 'visible', background: 'rgba(3, 172, 14, 1.0)' }}>
      <div className="container px-4 px-md-5">
        <div className="row d-flex align-items-md-center justify-content-md-between" style={{ minHeight: '380px' }}>
          
          <div className="col-12 col-md-5 text-center position-relative z-1 order-md-2 mb-3 mb-md-0" style={{ display: 'grid', placeItems: 'center' }}>
            {images.map((img, index) => (
              <div 
                key={index}
                className={`position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center ${index === currentIndex ? 'active' : ''}`}
                style={{
                  opacity: index === currentIndex ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: index === currentIndex ? 2 : 1
                }}
              >
                <img src={img} alt="Ambassador" className="img-fluid ambassador-popout" />
              </div>
            ))}
          </div>

          <div className="col-12 col-md-7 pt-0 pt-md-3 pb-5 text-white text-center text-md-start z-2 order-md-1">
            {/* FIXED: Memberikan warna latar putih solid kontras dengan teks brand hijau terang */}
            <span className="badge mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm" style={{ color: '#03AC0E', backgroundColor: '#ffffff' }}>
              E-COMMERCE TERLENGKAP
            </span>
            <h1 className="fw-bolder display-5 mb-3 text-white" style={{ letterSpacing: '-0.5px', lineHeight: '1.2' }}>
              Solusi Belanja Kebutuhan Harian & Lifestyle Anda!
            </h1>
            <p className="lead mb-4 opacity-90 fs-6 fw-medium text-white">
              Temukan penawaran terbaik untuk berbagai macam kategori mulai dari gadget mutakhir, pakaian trendi, hingga perlengkapan rumah tangga original. Nikmati jaminan garansi resmi dan bebas ongkir ke seluruh wilayah Indonesia!
            </p>
            <button className="btn bg-white fw-bold px-4 py-2.5 shadow-sm" style={{ borderRadius: '12px', color: '#03AC0E' }}>
              Mulai Belanja 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-2 mb-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;