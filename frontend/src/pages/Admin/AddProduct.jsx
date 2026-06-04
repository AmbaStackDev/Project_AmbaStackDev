import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../utils/productApi';

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("location", formData.location);
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }
      await createProduct(dataToSend);
      alert("Produk berhasil ditambahkan!");
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">Tambah Produk Baru</h3>
      <form onSubmit={handleSubmit} className="glass-panel p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nama Produk</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Harga (Rp)</label>
          <input type="number" name="price" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Lokasi Toko</label>
          <input type="text" name="location" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="form-label">Foto Produk</label>
          <input type="file" name="image" accept="image/*" className="form-control" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;