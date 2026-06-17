import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../utils/productApi';
import AdminNavbar from '../../components/Navbar/AdminNavbar';
import mascotAdd from '../../assets/mascotadd.png'; 
import SizeAlertModal from '../../components/Modal/SizeAlertModal';

function AddProduct({ showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", location: "", stock: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);

  const brandColor = '#03AC0E';

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.size > 2 * 1024 * 1024) {
        setShowSizeAlert(true);
        e.target.value = null; 
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

      await createProduct(dataToSend);
      if (showToast) showToast("Produk baru berhasil didaftarkan!");
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Sistem gagal mengunggah data produk baru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />

      <div className="container px-3 mt-4 flex-grow-1 d-flex align-items-center">
        <div className="row justify-content-center align-items-center g-4 g-lg-5 w-100 m-0">
          
          <div className="col-lg-5 text-center d-none d-lg-block">
            <img src={mascotAdd} alt="Mascot Add" className="img-fluid mb-4" style={{ maxWidth: '240px' }} />
            <h3 className="fw-black mb-2" style={{ color: brandColor }}>Tambah Produk Baru</h3>
            <p className="text-secondary small px-4 lh-lg fw-medium">Masukkan data produk Anda dengan benar agar langsung tampil di katalog etalase utama pembeli.</p>
          </div>

          <div className="col-12 col-lg-7 px-0 px-md-3">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm w-100 border">
              <div className="mb-4 text-center text-md-start">
                <h3 className="fw-black text-dark mb-1">Tambah Produk</h3>
                <p className="text-secondary small fw-medium mb-0">Rilis data produk baru ke dalam database toko.</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Nama Produk</label>
                  <input type="text" name="name" className="form-control p-3 border-0 shadow-sm bg-light" placeholder="Masukkan nama produk..." onChange={handleChange} required />
                </div>
                
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Harga (IDR)</label>
                    <input type="number" name="price" className="form-control p-3 border-0 shadow-sm bg-light" placeholder="150000" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Stok Awal</label>
                    <input type="number" name="stock" className="form-control p-3 border-0 shadow-sm bg-light" placeholder="10" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-dark small">Lokasi</label>
                    <input type="text" name="location" className="form-control p-3 border-0 shadow-sm bg-light" placeholder="Depok" onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Deskripsi Produk</label>
                  <textarea name="description" className="form-control p-3 border-0 shadow-sm bg-light" rows="3" placeholder="Masukkan detail informasi, spesifikasi, dan keunggulan produk secara lengkap..." onChange={handleChange} required></textarea>
                </div>

                <div className="mb-4">
                  <label className="fw-bold mb-2 small text-dark">Foto Produk</label>
                  <label htmlFor="upload-add" className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-secondary shadow-sm" style={{cursor:'pointer', border: `2px dashed ${brandColor}`, backgroundColor: '#f0fdf4'}}>
                    <span className="fw-bold mb-2" style={{ color: brandColor }}>{preview ? "Ganti Foto Visual" : "Klik untuk pilih foto produk (Maks 2MB)"}</span>
                    {preview && <img src={preview} alt="preview" className="rounded-3 shadow-sm border mt-2" style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />}
                  </label>
                  <input type="file" id="upload-add" name="image" accept="image/*" className="d-none" onChange={handleChange} required />
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 pt-3">
                  <Link to="/admin" className="btn btn-light w-100 fw-bold border shadow-sm text-secondary py-3 rounded-3">Batal</Link>
                  <button type="submit" className="btn text-white w-100 fw-bold shadow-sm py-3 rounded-3" style={{ background: brandColor }} disabled={loading}>
                    {loading ? "Menyimpan ke Database..." : "Simpan Produk"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PERINGATAN UKURAN FILE TERPISAH (Muncul Jika File > 2MB) */}
      <SizeAlertModal show={showSizeAlert} onClose={() => setShowSizeAlert(false)} />
      
    </div>
  );
}

export default AddProduct;