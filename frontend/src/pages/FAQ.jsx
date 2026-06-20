import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FAQ() {
  const brandColor = '#03AC0E';
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      q: "Apakah produk yang dijual di AmbaCart dijamin original?",
      a: "Tentu saja! Kami bekerja sama langsung dengan distributor resmi dan memastikan seluruh produk 100% original. Garansi uang kembali jika produk terbukti palsu."
    },
    {
      q: "Bagaimana cara melacak pesanan saya?",
      a: "Setelah penjual memproses dan mengirimkan pesanan, kamu akan menerima Nomor Resi. Kamu bisa melihat status dan nomor resi tersebut di menu 'Riwayat Pesanan' pada Navbar."
    },
    {
      q: "Apakah saya bisa membatalkan pesanan?",
      a: "Pesanan dapat dibatalkan selama statusnya masih 'Pending' atau belum diproses oleh Penjual. Jika sudah dalam tahap pengiriman, pesanan tidak dapat dibatalkan."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "AmbaCart mendukung berbagai metode pembayaran modern, mulai dari Transfer Bank, Virtual Account, Kartu Kredit, hingga E-Wallet (GoPay, OVO, DANA)."
    },
    {
      q: "Bagaimana kebijakan pengembalian barang (Retur)?",
      a: "Kamu dapat mengajukan retur maksimal 7 hari setelah barang diterima, dengan syarat barang cacat produksi atau tidak sesuai pesanan. Sertakan video unboxing sebagai bukti yang sah."
    }
  ];

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Tutup jika diklik lagi
    } else {
      setActiveIndex(index); // Buka yang baru
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 24px; }
        .faq-item { border-bottom: 1.5px solid rgba(0,0,0,0.05); }
        .faq-item:last-child { border-bottom: none; }
        .faq-question { cursor: pointer; transition: color 0.2s; }
        .faq-question:hover { color: ${brandColor} !important; }
        .faq-icon { transition: transform 0.3s ease; color: ${brandColor}; }
        .faq-icon.open { transform: rotate(180deg); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out; opacity: 0; }
        .faq-answer.open { max-height: 200px; padding-bottom: 20px; opacity: 1; }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-5">
            <h2 className="fw-black text-dark display-6 mb-3">Pusat Bantuan & FAQ</h2>
            <p className="text-secondary lead fw-medium">Temukan jawaban cepat untuk pertanyaan-pertanyaan umum seputar AmbaCart di bawah ini.</p>
          </div>

          <div className="glass-panel p-4 p-md-5 shadow-sm">
            {faqs.map((faq, index) => (
              <div className="faq-item py-3" key={index}>
                <div 
                  className="faq-question d-flex justify-content-between align-items-center py-2" 
                  onClick={() => toggleAccordion(index)}
                >
                  <h6 className="fw-bold text-dark mb-0 pe-4 lh-base" style={{ color: activeIndex === index ? brandColor : '' }}>
                    {faq.q}
                  </h6>
                  <div className={`faq-icon flex-shrink-0 ${activeIndex === index ? 'open' : ''}`}>
                    {/* Ikon Chevron Down Solid */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </div>
                </div>
                <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                  <p className="text-secondary mb-0 fw-medium small lh-lg pe-md-5 pt-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <p className="text-secondary small fw-medium">
              Tidak menemukan jawaban yang dicari? <br className="d-md-none"/>
              <Link to="/hubungi-kami" className="text-decoration-none fw-bold" style={{ color: brandColor }}>Hubungi Tim Support Kami</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;