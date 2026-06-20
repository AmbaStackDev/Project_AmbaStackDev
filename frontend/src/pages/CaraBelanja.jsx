import React from 'react';
import { Link } from 'react-router-dom';

function CaraBelanja() {
  const brandColor = '#03AC0E';

  const steps = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>,
      title: "Cari Produk Idamanmu",
      desc: "Telusuri katalog etalase AmbaCart atau gunakan kolom pencarian untuk menemukan barang yang kamu butuhkan dengan harga terbaik."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>,
      title: "Masukkan ke Keranjang",
      desc: "Pilih jumlah barang yang diinginkan dan klik tombol '+ Keranjang'. Jangan lupa periksa kembali rincian pesananmu."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1h-14V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>,
      title: "Checkout & Bayar",
      desc: "Isi alamat pengiriman yang lengkap di halaman profil, lalu lakukan pembayaran menggunakan metode yang tersedia dengan aman."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 2a.5.5 0 0 0-.5.5V15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5H.5zM5 10a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>,
      title: "Barang Dikirim",
      desc: "Duduk santai! Pesananmu akan segera diproses oleh penjual dan dikirimkan oleh kurir terpercaya sampai ke depan pintu rumahmu."
    }
  ];

  return (
    <div className="container mt-4 mb-5">
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 24px; }
        .step-card { transition: all 0.3s ease; cursor: default; }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(3,172,14,0.15) !important; border-color: ${brandColor} !important; }
        .icon-circle { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: rgba(3,172,14,0.1); color: ${brandColor}; transition: all 0.3s ease; }
        .step-card:hover .icon-circle { background-color: ${brandColor}; color: white; }
        .step-number { position: absolute; top: -15px; left: -15px; width: 40px; height: 40px; background: ${brandColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; border: 4px solid #f8f9fa; z-index: 2; }
      `}</style>

      <div className="text-center mb-5">
        <h2 className="fw-black text-dark display-6 mb-3">Cara Belanja di AmbaCart</h2>
        <p className="text-secondary lead fw-medium mx-auto" style={{maxWidth: '600px'}}>Mudah, cepat, dan aman! Ikuti empat langkah sederhana ini untuk mulai berbelanja produk favoritmu.</p>
      </div>

      <div className="row g-4 g-lg-5 position-relative pt-3">
        {steps.map((step, index) => (
          <div className="col-12 col-md-6 col-lg-3" key={index}>
            <div className="glass-panel p-4 p-md-4 h-100 step-card position-relative shadow-sm text-center">
              <div className="step-number shadow-sm">{index + 1}</div>
              <div className="d-flex justify-content-center mb-4 mt-2">
                <div className="icon-circle">
                  {step.icon}
                </div>
              </div>
              <h5 className="fw-bolder text-dark mb-3">{step.title}</h5>
              <p className="text-secondary small mb-0 lh-lg">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 pt-4">
        <Link to="/" className="btn text-white fw-bold px-5 py-3 rounded-pill shadow-sm" style={{ backgroundColor: brandColor, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#028a0a'} onMouseOut={e => e.currentTarget.style.backgroundColor = brandColor}>
          Mulai Belanja Sekarang
        </Link>
      </div>
    </div>
  );
}

export default CaraBelanja;