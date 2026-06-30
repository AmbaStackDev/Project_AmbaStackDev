import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../utils/productApi';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotAdd from '../../assets/mascotadd.png'; 
import SizeAlertModal from '../../components/Modal/SizeAlertModal';
import http from '../../utils/http';

function AddProduct({ showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", location: "", stock: "", description: "", category_id: "", image: null });
  const [preview, setPreview] = useState(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [categories, setCategories] = useState([]);
  const brandColor = '#03AC0E';

  useEffect(() => {
    http.get('/categories').then(res => setCategories(res.data.data || [])).catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.size > 2 * 1024 * 1024) { setShowSizeAlert(true); e.target.value = null; return; }
      setFormData({ ...formData, [name]: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    } else { setFormData({ ...formData, [name]: value }); }
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
      dataToSend.append("category_id", formData.category_id); 
      if (formData.image) dataToSend.append("image", formData.image);

      await createProduct(dataToSend);
      if (showToast) showToast("Produk baru berhasil didaftarkan!");
      navigate('/admin');
    } catch (error) { alert("Gagal mengunggah produk. Pastikan semua terisi."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2" style={{ maxWidth: '800px' }}>
        
        {/* FIXED: BANNER DIBUAT TIDAK OVERFLOW DAN DIBERI RUANG (mt-5) AGAR MASKOT NONGOL */}
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4 mt-4" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '70%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Tambah Produk</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Lengkapi data untuk mendaftarkan barang baru ke etalase Anda.</p>
          </div>
          {/* Posisi top di-minus agar keluar batas kotak */}
          <img src={mascotAdd} alt="Mascot Add" className="position-absolute d-none d-sm-block" style={{ width: '180px', right: '5%', top: '-35px', zIndex: 5, filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.3))' }} onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm w-100 border">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Nama Produk</label>
              <input type="text" name="name" className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Kategori Produk</label>
                <select name="category_id" className="form-select p-3 border-0 shadow-sm bg-light fw-medium" onChange={handleChange} required value={formData.category_id}>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {(categories || []).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Lokasi / Gudang</label>
                <input type="text" name="location" className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Harga (IDR)</label>
                <input type="number" name="price" className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Stok Awal</label>
                <input type="number" name="stock" className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Deskripsi Produk</label>
              <textarea name="description" className="form-control p-3 border-0 shadow-sm bg-light" rows="3" onChange={handleChange} required></textarea>
            </div>
            <div className="mb-4">
              <label className="fw-bold mb-2 small text-dark">Foto Produk</label>
              <label htmlFor="upload-add" className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-secondary shadow-sm hover-bg-light" style={{cursor:'pointer', border: `2px dashed ${brandColor}`, backgroundColor: '#f0fdf4', transition: 'background 0.3s'}}>
                <span className="fw-bold mb-2" style={{ color: brandColor }}>{preview ? "Ganti Foto Visual" : "Klik untuk pilih foto produk (Maks 2MB)"}</span>
                {preview && <img src={preview} alt="preview" className="rounded-3 shadow-sm border mt-2" style={{ maxHeight: '140px' }} />}
              </label>
              <input type="file" id="upload-add" name="image" accept="image/*" className="d-none" onChange={handleChange} required />
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3 pt-3">
              <Link to="/admin" className="btn btn-light w-100 fw-bold border shadow-sm text-secondary py-3 rounded-pill hover-scale">Batal</Link>
              <button type="submit" className="btn text-white w-100 fw-bold shadow-sm py-3 rounded-pill hover-scale" style={{ background: brandColor }} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SizeAlertModal show={showSizeAlert} onClose={() => setShowSizeAlert(false)} />
    </div>
  );
}

export default AddProduct;