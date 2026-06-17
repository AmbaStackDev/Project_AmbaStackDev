import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../../utils/http'; 
import ambaNormal from '../../assets/mascot1.png';
import AuthAlertModal from '../../components/Modal/AuthAlertModal';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Sesi State kontrol pop-up modal kustom
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await http.post('/auth/register', formData);

      // Setup pemicu modal sukses registrasi
      setAlertModal({
        show: true,
        type: 'success',
        title: 'Pendaftaran Berhasil!',
        message: 'Akun administrator Anda telah sukses dikonfigurasi. Silakan masuk menggunakan kredensial baru Anda.',
        onConfirm: () => navigate('/login')
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gagal mendaftar. Periksa kembali struktur data Anda.';
      
      // Setup pemicu modal error kegagalan registrasi database
      setAlertModal({
        show: true,
        type: 'error',
        title: 'Registrasi Gagal',
        message: errorMsg,
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
    } finally {
      setLoading(false);
    }
  };

  const brandColor = '#03AC0E';

  return (
    <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white position-relative" style={{ maxWidth: '400px', margin: '80px auto 20px auto', overflow: 'visible' }}>
      
      {/* Tombol kembali ke beranda */}
      <button 
        type="button" 
        onClick={() => navigate('/')} 
        className="btn btn-light text-secondary rounded-circle shadow-sm d-flex align-items-center justify-content-center position-absolute" 
        style={{ 
          top: '20px', 
          left: '20px', 
          width: '40px', 
          height: '40px', 
          zIndex: 20, 
          backgroundColor: '#f8f9fa',
          transition: 'all 0.2s ease-in-out'
        }}
        title="Kembali ke Beranda"
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.color = brandColor; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#6c757d'; }}
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
      </button>

      <style>{`
        .amba-input-field { transition: all 0.2s ease-in-out; border: 1.5px solid rgba(0,0,0,0.08) !important; }
        .amba-input-field:hover { border-color: ${brandColor}50 !important; background-color: #ffffff !important; }
        .amba-input-field:focus { border-color: ${brandColor} !important; box-shadow: 0 0 0 0.25rem rgba(3, 172, 14, 0.15) !important; background-color: #ffffff !important; }
        .btn-amba-submit { background-color: ${brandColor} !important; border: none !important; transition: all 0.2s ease-in-out !important; }
        .btn-amba-submit:hover { background-color: #028a0a !important; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(3, 172, 14, 0.25); }
        .btn-amba-submit:active { transform: translateY(0); }
        .eye-icon-smooth { transition: color 0.2s ease-in-out, transform 0.2s ease-in-out; }
        .eye-icon-smooth:hover { color: ${brandColor} !important; transform: scale(1.1); }
      `}</style>

      {/* MASKOT POP-OUT */}
      <div className="text-center mb-4 position-relative" style={{ marginTop: '-75px', zIndex: 10 }}>
        <img 
          src={ambaNormal} 
          alt="Mascot" 
          className="img-fluid mb-2" 
          style={{ maxWidth: '110px', filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.15))' }} 
        />
        <h3 className="fw-black text-dark mb-1">Daftar Akun</h3>
        <p className="text-secondary small fw-medium mb-0">Bergabung ke dalam ekosistem AmbaCart</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold small text-dark">Nama Lengkap</label>
          <input 
            type="text" 
            name="name" 
            className="form-control p-3 bg-light amba-input-field" 
            placeholder="Ketik nama lengkap..." 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold small text-dark">Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-control p-3 bg-light amba-input-field" 
            placeholder="nama@email.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold small text-dark">Password</label>
          <div className="input-group rounded-3 overflow-hidden position-relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              className="form-control p-3 bg-light amba-input-field" 
              placeholder="Buat sandi yang aman..." 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button 
              type="button" 
              className="btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent px-3 text-secondary eye-icon-smooth" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ zIndex: 10 }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn w-100 text-white fw-bold py-3 btn-amba-submit rounded-3 mb-3"
          disabled={loading}
        >
          {loading ? 'Memproses Akun...' : 'Daftar Sekarang'}
        </button>

        <p className="text-center small fw-medium text-secondary mt-3 mb-0">
          Sudah punya akun? <Link to="/login" style={{ color: brandColor, textDecoration: 'none', fontWeight: 'bold' }}>Masuk di sini</Link>
        </p>
      </form>

      {/* RENDER MODAL ALER AUTH TERPISAH */}
      <AuthAlertModal 
        show={alertModal.show}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={alertModal.onConfirm}
      />
    </div>
  );
}

export default Register;