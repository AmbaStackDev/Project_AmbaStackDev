import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../../utils/productApi';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotEdit from '../../assets/mascotedit.png'; 
import SizeAlertModal from '../../components/Modal/SizeAlertModal';
import http from '../../utils/http';

function EditProduct({ showToast }) {
  const { id } = useParams(); 
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

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getProductById(id);
        const data = response.data.data;
        setFormData({ name: data.name, price: data.price, location: data.location, stock: data.stock, description: data.description || "", category_id: data.category_id || "", image: null });
      } catch (error) { console.error(error); }
    };
    fetchDetail();
  }, [id]);

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

      await updateProduct(id, dataToSend);
      if (showToast) showToast("Perubahan data produk sukses disimpan!");
      navigate('/admin');
    } catch (error) { alert("Gagal melakukan pembaharuan data produk."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2" style={{ maxWidth: '800px' }}>
        
        {/* FIXED: Ruang MT-4 ditambahkan agar maskot leluasa keluar */}
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4 mt-4" style={{ background: 'linear-gradient(135deg, #f59f00 0%, #d97706 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '70%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Edit Produk #{id}</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Perbarui harga, stok, dan detail barang jualan Anda.</p>
          </div>
          <img src={mascotEdit} alt="Mascot Edit" className="position-absolute d-none d-sm-block" style={{ width: '220px', right: '5%', top: '-35px', zIndex: 5, filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.3))' }} onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm w-100 border">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Nama Produk</label>
              <input type="text" name="name" value={formData.name} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Kategori Produk</label>
                <select name="category_id" className="form-select p-3 border-0 shadow-sm bg-light fw-medium" onChange={handleChange} required value={formData.category_id || ""}>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {(categories || []).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Lokasi / Gudang</label>
                <input type="text" name="location" value={formData.location} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Harga (IDR)</label>
                <input type="number" name="price" value={formData.price} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-dark small">Stok</label>
                <input type="number" name="stock" value={formData.stock} className="form-control p-3 border-0 shadow-sm bg-light" onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Deskripsi Produk</label>
              <textarea name="description" value={formData.description} className="form-control p-3 border-0 shadow-sm bg-light" rows="3" onChange={handleChange} required></textarea>
            </div>
            <div className="mb-4">
              <label className="fw-bold mb-2 small text-dark">Ganti Gambar <span className="text-muted fw-normal">(Opsional)</span></label>
              <label htmlFor="upload-edit" className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-secondary shadow-sm hover-bg-light" style={{cursor:'pointer', border: '2px dashed #ffc107', backgroundColor: '#fffdf5', transition: 'background 0.3s'}}>
                <span className="fw-bold mb-2 text-warning">{preview ? "Ganti Foto Baru" : "Klik untuk timpa dengan foto (Maks 2MB)"}</span>
                {preview && <img src={preview} alt="Preview" className="rounded-3 shadow-sm border mt-2" style={{ maxHeight: '140px' }} />}
              </label>
              <input type="file" id="upload-edit" name="image" accept="image/*" className="d-none" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3 pt-3">
              <Link to="/admin" className="btn btn-light w-100 fw-bold border shadow-sm text-secondary py-3 rounded-pill hover-scale">Batal</Link>
              <button type="submit" className="btn btn-warning w-100 fw-bold shadow-sm py-3 rounded-pill text-dark hover-scale" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SizeAlertModal show={showSizeAlert} onClose={() => setShowSizeAlert(false)} />
    </div>
  );
}

export default EditProduct;