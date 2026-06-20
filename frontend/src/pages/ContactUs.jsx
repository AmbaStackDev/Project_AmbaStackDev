import React, { useState } from 'react';

function ContactUs() {
  const brandColor = '#03AC0E';
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman pesan
    setIsSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="container mt-4 mb-5">
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 24px; }
        .amba-input { border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; transition: all 0.2s; background: #f8f9fa; }
        .amba-input:focus { border-color: ${brandColor}; box-shadow: 0 0 0 4px rgba(3,172,14,0.15); background: #ffffff; }
        .contact-icon { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background-color: rgba(3,172,14,0.1); color: ${brandColor}; }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="text-center mb-5">
            <h2 className="fw-black text-dark display-6 mb-3">Hubungi Kami</h2>
            <p className="text-secondary lead fw-medium">Punya pertanyaan, keluhan, atau butuh bantuan? Tim AmbaCart siap mendengarkan.</p>
          </div>

          <div className="row g-4">
            {/* Kolom Informasi */}
            <div className="col-12 col-md-5">
              <div className="glass-panel p-4 p-md-5 h-100 shadow-sm d-flex flex-column justify-content-center">
                <h4 className="fw-bolder text-dark mb-4">Informasi Kontak</h4>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/></svg>
                  </div>
                  <div>
                    <span className="d-block text-secondary small fw-bold">Email Dukungan</span>
                    <span className="fw-bold text-dark">support@ambacart.com</span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>
                  </div>
                  <div>
                    <span className="d-block text-secondary small fw-bold">Telepon / WhatsApp</span>
                    <span className="fw-bold text-dark">+62 812-3456-7890</span>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="contact-icon me-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                  </div>
                  <div>
                    <span className="d-block text-secondary small fw-bold">Kantor Pusat</span>
                    <span className="fw-bold text-dark">AmbaStack Tower, Lt. 14<br/>Depok, Jawa Barat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Form */}
            <div className="col-12 col-md-7">
              <div className="glass-panel p-4 p-md-5 shadow-sm">
                <h4 className="fw-bolder text-dark mb-4">Kirim Pesan Langsung</h4>
                
                {isSent ? (
                  <div className="alert alert-success d-flex align-items-center rounded-3 p-4 mb-0" style={{backgroundColor: 'rgba(3,172,14,0.1)', border: 'none', color: brandColor}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="me-3 flex-shrink-0" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                    <div>
                      <h6 className="fw-bold mb-1">Pesan Terkirim!</h6>
                      <p className="mb-0 small">Terima kasih telah menghubungi kami. Tim AmbaCart akan segera merespons pesanmu via Email.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-secondary">Nama Lengkap</label>
                      <input type="text" className="form-control amba-input fw-medium text-dark" placeholder="Siapa namamu?" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-secondary">Alamat Email</label>
                      <input type="email" className="form-control amba-input fw-medium text-dark" placeholder="nama@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-secondary">Pesan / Keluhan</label>
                      <textarea className="form-control amba-input fw-medium text-dark" rows="4" placeholder="Tuliskan detail pertanyaan atau keluhanmu di sini..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                    </div>
                    <button type="submit" className="btn text-white fw-bold px-4 py-3 rounded-3 shadow-sm w-100" style={{ backgroundColor: brandColor }}>
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;