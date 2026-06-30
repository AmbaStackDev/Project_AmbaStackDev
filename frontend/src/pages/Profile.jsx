import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import http from '../utils/http';
import AuthAlertModal from '../components/Modal/AuthAlertModal';

function Profile() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone_number: '', city: '', postal_code: '', address: ''
  });

  const [alertModal, setAlertModal] = useState({
    show: false, type: 'success', title: '', message: '', onConfirm: null
  });

  // KEMBALI KE HIJAU AMBACART ORIGINAL
  const brandColor = '#03AC0E'; 
  const brandColorHover = '#028a0a';

  let userRole = 'customer';
  let userId = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role || 'customer'; 
      userId = payload.id;
    } catch (e) {}
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await http.get('/users/profile');
        const userData = response.data.data;
        
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          city: userData.city || '',
          postal_code: userData.postal_code || '',
          address: userData.address || ''
        });
      } catch (error) {
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setFormData(prev => ({ ...prev, name: payload.name || '', email: payload.email || '' }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await http.put('/users/profile', formData);
      setAlertModal({
        show: true, type: 'success', title: 'Profil Diperbarui!',
        message: 'Data profil dan alamat pengiriman Anda berhasil disimpan.',
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
    } catch (error) {
      setAlertModal({
        show: true, type: 'error', title: 'Pembaruan Gagal',
        message: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/'); 
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{background: '#f8f9fa'}}>
        <div className="spinner-border" style={{ color: brandColor, width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.9) !important; backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6) !important; border-radius: 24px; }
        .amba-input-field { transition: all 0.25s; border: 1.5px solid rgba(0,0,0,0.08) !important; border-radius: 14px !important; padding: 14px 16px 14px 48px !important; font-size: 0.95rem; }
        .amba-input-field:hover { border-color: ${brandColor}60 !important; background-color: #ffffff !important; }
        .amba-input-field:focus { border-color: ${brandColor} !important; box-shadow: 0 0 0 4px rgba(3, 172, 14, 0.15) !important; background-color: #ffffff !important; }
        .amba-input-group-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; z-index: 5; transition: color 0.25s; }
        .form-floating:focus-within .amba-input-group-icon, .position-relative:focus-within .amba-input-group-icon { color: ${brandColor}; }
        
        .btn-amba-confirm { background-color: ${brandColor} !important; color: white !important; transition: all 0.25s ease; border: none !important; }
        .btn-amba-confirm:hover { background-color: ${brandColorHover} !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(3, 172, 14, 0.3); }
        .btn-amba-confirm:active { transform: translateY(0); }
        
        .profile-header-bg { background: linear-gradient(135deg, #0ce61f 0%, ${brandColor} 100%); border-radius: 24px 24px 0 0; height: 110px; width: 100%; position: absolute; top: 0; left: 0; z-index: 1; }
        .icon-box-green { background-color: rgba(3, 172, 14, 0.12); color: ${brandColor}; padding: 10px; border-radius: 12px; }
      `}</style>

      <div className="container mt-3 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            
            <div className="row g-4">
              
              {/* KOLOM KIRI: IDENTITAS VISUAL & TOMBOL AKSI */}
              <div className="col-12 col-xl-4">
                <div className="glass-panel p-4 text-center d-flex flex-column align-items-center position-relative shadow-sm h-100" style={{overflow: 'hidden'}}>
                  <div className="profile-header-bg"></div>

                  <div className="position-relative mb-3 mt-4" style={{ width: '130px', height: '130px', zIndex: 2 }}>
                    <img 
                      src={`https://ui-avatars.com/api/?name=${formData.name}&background=ffffff&color=03AC0E&bold=true&size=150&font-size=0.45`} 
                      alt="Avatar" 
                      className="rounded-circle shadow-lg border border-4 border-white w-100 h-100" 
                      style={{objectFit: 'cover'}}
                    />
                    <div className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-sm border" style={{ cursor: 'pointer' }} title="Ubah Foto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={brandColor} viewBox="0 0 16 16">
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="fw-black text-dark mb-1 position-relative" style={{zIndex: 2}}>{formData.name || 'Nama Pengguna'}</h4>
                  <p className="text-secondary small mb-3 position-relative text-truncate w-100 px-3" style={{zIndex: 2}}>{formData.email}</p>
                  
                  <span className={`badge px-3 py-2 rounded-pill position-relative mb-4 fw-bold ${userRole === 'admin' ? 'bg-warning text-dark' : 'bg-success text-white'}`} style={{zIndex: 2, fontSize: '0.75rem', backgroundColor: userRole !== 'admin' ? brandColor : ''}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1 mb-1" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 8A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    Akun {userRole === 'admin' ? 'Admin' : 'Pembeli'}
                  </span>

                  <div className="w-100 mt-auto pt-4 border-top">
                    <button onClick={() => navigate('/')} className="btn btn-light text-secondary w-100 fw-bold py-3 rounded-4 border mb-3 shadow-sm d-flex align-items-center justify-content-center hover-scale">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2 text-muted" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                      </svg>
                      Kembali ke Etalase
                    </button>

                    <button onClick={() => setShowLogoutModal(true)} className="btn btn-light text-danger w-100 fw-bold py-3 rounded-4 border shadow-sm d-flex align-items-center justify-content-center hover-scale" style={{backgroundColor: '#fffcfc'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L10.5 10.793V1.5a.5.5 0 0 0-1 0v9.293l-2.146-2.147a.5.5 0 0 0-.708 0z"/>
                      </svg>
                      Keluar Sesi
                    </button>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: FORM DATA */}
              <div className="col-12 col-xl-8">
                <form onSubmit={handleSubmit} className="glass-panel p-4 p-md-5 shadow-sm h-100 d-flex flex-column">
                  
                  {/* Bagian 1: Data Diri */}
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div className="icon-box-green me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h5 className="fw-bolder text-dark mb-1">Informasi Pribadi</h5>
                        <p className="text-secondary small mb-0">Pastikan nama dan nomor handphone Anda valid.</p>
                    </div>
                  </div>
                  
                  <div className="row g-4 mb-4">
                    <div className="col-md-6 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Nama Lengkap</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
                        <input type="text" name="name" className="form-control bg-light amba-input-field fw-bold text-dark" placeholder="Ketik nama lengkap..." value={formData.name} onChange={handleChange} required />
                      </div>
                    </div>
                    
                    <div className="col-md-6 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Email</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
                        <input type="email" className="form-control bg-light amba-input-field text-secondary" value={formData.email} disabled style={{cursor: 'not-allowed', borderStyle: 'dashed'}} />
                      </div>
                    </div>

                    <div className="col-md-6 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Nomor Handphone</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" viewBox="0 0 16 16"><path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/><path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
<input type="text" name="phone_number" className="form-control bg-light amba-input-field fw-bold text-dark" placeholder="Contoh: 08123456789" value={formData.phone_number} onChange={handleChange} required />                      </div>
                    </div>
                  </div>

                  {/* Bagian 2: Alamat Pengiriman */}
                  <div className="d-flex align-items-center mb-4 pb-3 mt-3 border-bottom">
                    <div className="icon-box-green me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
                        </svg>
                    </div>
                    <div>
                        <h5 className="fw-bolder text-dark mb-1">Alamat Pengiriman</h5>
                        <p className="text-secondary small mb-0">Tujuan pengiriman pesanan Anda.</p>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-8 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Kota / Kabupaten</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                        <input type="text" name="city" className="form-control bg-light amba-input-field fw-bold text-dark" placeholder="Ketik kota tujuan..." value={formData.city} onChange={handleChange} required />                      </div>
                    </div>

                    <div className="col-md-4 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Kode Pos</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                        <input type="text" name="postal_code" className="form-control bg-light amba-input-field fw-bold text-dark" placeholder="16514" value={formData.postal_code} onChange={handleChange} maxLength={5} required />                      </div>
                    </div>

                    <div className="col-12 position-relative">
                      <label className="form-label fw-bold small text-secondary ms-1">Alamat Lengkap</label>
                      <div className="position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="amba-input-group-icon" style={{top: '26px'}} viewBox="0 0 16 16"><path d="M8 0c-2.21 0-4 1.79-4 4 0 1.2.53 2.27 1.38 3H1c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1h-2.38C13.47 6.27 14 5.2 14 4c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM1 9h14v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9z"/></svg>
<textarea name="address" className="form-control bg-light amba-input-field fw-bold text-dark" rows="3" placeholder="Provinsi, Kecamatan, Nama Jalan, RT/RW, Patokan..." value={formData.address} onChange={handleChange} required style={{paddingLeft: '48px !important', paddingTop: '16px !important'}}></textarea>                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 d-flex justify-content-end">
                    <button type="submit" className="btn btn-amba-confirm fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center" disabled={saving}>
                      {saving ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Menyimpan...
                        </>
                      ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16">
                                <path d="M11 2H9v3h2V2Z"/><path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.414 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H1.5A1.5 1.5 0 0 1 0 14.5V1.5A1.5 1.5 0 0 1 1.5 0ZM1 1.5v13a.5.5 0 0 0 .5.5H13v-3.914a.5.5 0 0 0-.146-.354l-.708-.708A.5.5 0 0 0 12 10H4a.5.5 0 0 0-.5.5v4H1.5a.5.5 0 0 0-.5-.5v-13Zm4 0v4h5v-4H5Z"/>
                            </svg>
                            Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <AuthAlertModal 
          show={alertModal.show} 
          type={alertModal.type} 
          title={alertModal.title} 
          message={alertModal.message} 
          onClose={alertModal.onConfirm} 
        />
      </div>

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="glass-panel p-4 p-md-5 w-100 text-center shadow-lg" style={{ maxWidth: '420px', borderRadius: '28px' }}>
            <div className="mb-4 text-danger d-flex justify-content-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0-.708 0l3-3a.5.5 0 0 0-.708-.708L10.5 10.793V1.5a.5.5 0 0 0-1 0v9.293l-2.146-2.147a.5.5 0 0 0-.708 0z"/>
                </svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Keluar Sesi?</h4>
            <p className="text-secondary small mb-4 px-2">Anda akan keluar dari akun AmbaCart ini. Apakah Anda yakin ingin melanjutkan?</p>
            <div className="d-flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-light text-secondary fw-bold w-50 py-3 rounded-pill border shadow-sm hover-scale">Batal</button>
              <button onClick={confirmLogout} className="btn btn-danger text-white fw-bold w-50 py-3 rounded-pill shadow-sm hover-scale">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;