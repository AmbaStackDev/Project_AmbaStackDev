import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../../utils/productApi';
import AdminNavbar from '../../components/Navbar/AdminNavbar';
import mascotEdit from '../../assets/mascotedit.png'; 
import SizeAlertModal from '../../components/Modal/SizeAlertModal';

function EditProduct({ showToast }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", location: "", stock: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
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

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />

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
                <p className="text-secondary small fw-medium mb-0">Ubah atribut data produk ID #{id} secara real-time.</p>
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

      {/* MODAL PERINGATAN UKURAN FILE TERPISAH (Muncul Jika File > 2MB) */}
      <SizeAlertModal show={showSizeAlert} onClose={() => setShowSizeAlert(false)} />

    </div>
  );
}

export default EditProduct;