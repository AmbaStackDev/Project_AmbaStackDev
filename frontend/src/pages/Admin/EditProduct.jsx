import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../../utils/productApi';
import mascotEdit from '../../assets/mascotedit.png'; 
import logoImg from '../../assets/logo.png';

function EditProduct({ showToast }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", location: "", stock: "", description: "", image: null });
  const [preview, setPreview] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // STATE BARU: Untuk kontrol modal pop-up peringatan ukuran file
  const [showSizeAlert, setShowSizeAlert] = useState(false);

  const brandColor = '#03AC0E';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getProductById(id);
        const data = response.data.data;
        setFormData({ 
          name: data.name, 
          price: data.price, 
          location: data.location, 
          stock: data.stock, 
          description: data.description || "", 
          image: null 
        });
      } catch (error) {
        console.error("Gagal sinkronisasi data produk", error);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Cek ukuran file (Batas Maksimal 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setShowSizeAlert(true); // Memunculkan custom modal
        e.target.value = null;  // Membatalkan file yang dipilih
        return;
      }

      setFormData({ ...formData, [name]: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("location", formData.location);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("description", formData.description); 
      if (formData.image) dataToSend.append("image", formData.image);

      await updateProduct(id, dataToSend);
      if (showToast) showToast("Perubahan data produk sukses disimpan!");
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan pembaharuan data produk.");
    } finally {
      setLoading(false);
    }
  };

  const executeLogout = () => {
    localStorage.removeItem('token');
    if (showToast) showToast("Berhasil logout dari sesi admin.");
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      
      <style>{`
        .nav-link-custom { color: #6c757d; text-decoration: none; font-weight: 600; transition: color 0.2s; padding: 8px 12px; border: none; background: transparent; }
        .nav-link-custom:hover { color: ${brandColor}; background-color: transparent; }
        .nav-link-active { color: ${brandColor}; text-decoration: none; font-weight: 700; border-bottom: 2px solid ${brandColor}; padding: 8px 0px; margin: 0 12px; }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar sticky-top shadow-sm px-4 py-3 bg-white" style={{ zIndex: 1040 }}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link className="navbar-brand fw-bold d-flex align-items-center m-0" to="/admin" style={{ color: brandColor }}>
            <img src={logoImg} alt="Logo" height="30" className="me-2" />
            AmbaCart <span className="text-secondary fw-medium fs-6 ms-2 d-none d-sm-inline">| Admin</span>
          </Link>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <Link to="/admin" className="nav-link-custom d-none d-md-block">Dashboard</Link>
            
            <Link to="/admin/add" className="btn btn-sm text-white fw-bold px-3 py-2 rounded-pill shadow-sm d-none d-md-flex align-items-center gap-1" style={{ backgroundColor: brandColor, border: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Tambah Produk
            </Link>
            
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="btn btn-outline-danger btn-sm fw-bold px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 ms-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-3 mt-4 flex-grow-1 d-flex align-items-center">
        <div className="row justify-content-center align-items-center g-4 g-lg-5 w-100 m-0">
          <div className="col-lg-5 text-center d-none d-lg-block">
            <img src={mascotEdit} alt="Mascot Edit" className="img-fluid mb-4" style={{ maxWidth: '280px' }} />
            <h3 className="fw-black text-warning mb-2">Edit Data Produk</h3>
            <p className="text-secondary small px-4 lh-lg fw-medium">Sesuaikan kembali informasi harga, lokasi, deskripsi, atau ketersediaan stok yang ada di database.</p>
          </div>

          <div className="col-12 col-lg-7 px-0 px-md-3">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm w-100 border">
              <div className="mb-4 text-center text-md-start">
                <h3 className="fw-black text-dark mb-1">Edit Produk</h3>
                <p className="text-secondary small fw-medium mb-0">Ubah atribut data produk secara langsung.</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Nama Produk</label>
                  <input type="text" name="name" value={formData.name} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
                </div>
                
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Harga (IDR)</label>
                    <input type="number" name="price" value={formData.price} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Stok</label>
                    <input type="number" name="stock" value={formData.stock} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Lokasi</label>
                    <input type="text" name="location" value={formData.location} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Deskripsi Produk</label>
                  <textarea name="description" value={formData.description} className="form-control p-3 border-0 shadow-sm bg-light" rows="3" placeholder="Masukkan detail informasi produk secara lengkap..." onChange={handleChange} required></textarea>
                </div>

                <div className="mb-4">
                  <label className="fw-bold mb-2 small text-dark">Ganti Gambar <span className="text-muted fw-normal">(Opsional)</span></label>
                  <label htmlFor="upload-edit" className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-secondary shadow-sm" style={{cursor:'pointer', border: '2px dashed #ffc107', backgroundColor: '#fffdf5'}}>
                    <span className="fw-bold mb-2 text-warning">{preview ? "Ganti Foto Baru" : "Klik untuk timpa dengan foto baru (Maks 2MB)"}</span>
                    {preview && <img src={preview} alt="Preview" className="rounded-3 shadow-sm border mt-2" style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />}
                  </label>
                  <input type="file" id="upload-edit" name="image" accept="image/*" className="d-none" onChange={handleChange} />
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 pt-3">
                  <Link to="/admin" className="btn btn-light w-100 fw-bold border shadow-sm text-secondary py-3 rounded-3">Batal</Link>
                  <button type="submit" className="btn btn-warning w-100 fw-bold shadow-sm py-3 rounded-3 text-dark" disabled={loading}>
                    {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL PERINGATAN UKURAN FILE */}
      {showSizeAlert && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-warning d-flex justify-content-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Ukuran Terlalu Besar!</h4>
            <p className="text-secondary small mb-4 px-2">Foto yang Anda pilih melebihi batas maksimal <b>2MB</b>. Silakan kompres foto Anda atau pilih foto lain yang berukuran lebih kecil.</p>
            <button onClick={() => setShowSizeAlert(false)} className="btn btn-warning text-dark fw-bold w-100 py-2.5 rounded-pill shadow-sm">Mengerti</button>
          </div>
        </div>
      )}

      {/* POPUP MODAL LOGOUT BARU */}
      {showLogoutModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-danger d-flex justify-content-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Ingin Logout?</h4>
            <p className="text-secondary small mb-4 px-2">Anda akan logout dari sesi administrator. Anda harus login kembali untuk mengelola toko.</p>
            <div className="d-flex flex-column gap-2">
              <button onClick={executeLogout} className="btn btn-danger fw-bold w-100 py-2.5 rounded-pill shadow-sm">Ya, Logout Sekarang</button>
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-light fw-bold w-100 py-2.5 rounded-pill text-secondary border">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProduct;