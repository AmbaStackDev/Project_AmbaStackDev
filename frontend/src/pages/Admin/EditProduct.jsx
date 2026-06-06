import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../utils/productApi';

function EditProduct({ showToast }) { // Terima showToast
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", price: "", location: "", image: null
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getProductById(id);
        const data = response.data.data;
        setFormData({
          name: data.name, price: data.price, location: data.location, image: null
        });
      } catch (error) {
        console.error("Gagal mengambil detail produk", error);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("location", formData.location);
      if (formData.image) dataToSend.append("image", formData.image);

      await updateProduct(id, dataToSend);
      showToast("Data produk berhasil diperbarui!"); // Gunakan Toast
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5 pb-5">
      <h3 className="fw-bold mb-4">Edit Produk</h3>
      <form onSubmit={handleSubmit} className="glass-panel p-4 shadow-sm" style={{ maxWidth: "600px" }}>
         <div className="mb-3">
          <label className="form-label">Nama Produk</label>
          <input type="text" name="name" value={formData.name} className="form-control" onChange={handleChange} required />
        </div>
        {/* INPUT YANG SEBELUMNYA BELUM DIBUAT OLEH NOVAL: */}
        <div className="mb-3">
          <label className="form-label">Harga (Rp)</label>
          <input type="number" name="price" value={formData.price} className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Lokasi Toko</label>
          <input type="text" name="location" value={formData.location} className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="form-label">Ganti Foto Produk (Opsional)</label>
          {/* File input tidak boleh diberi value */}
          <input type="file" name="image" accept="image/*" className="form-control" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading}>
          {loading ? "Menyimpan Perubahan..." : "Update Produk"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;