import React, { useState, useEffect } from 'react';
import http from '../../utils/http';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotAdmin from '../../assets/mascotadmin.png'; 

function AdminCategories({ showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successPopup, setSuccessPopup] = useState({ show: false, message: '' });
  
  const brandColor = '#03AC0E';

  const fetchCategories = async () => {
    try {
      const res = await http.get('/categories');
      setCategories(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const triggerSuccess = (message) => {
    setSuccessPopup({ show: true, message });
    if (showToast) showToast(message);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await http.post('/categories', formData);
      setFormData({ name: '', description: '' });
      fetchCategories();
      triggerSuccess('Kategori baru berhasil ditambahkan!');
    } catch (err) { alert('Gagal menambah kategori.'); } 
    finally { setLoading(false); }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await http.put(`/categories/${editData.id}`, editData);
      setShowEditModal(false);
      fetchCategories();
      triggerSuccess('Kategori berhasil diperbarui!');
    } catch (err) { alert('Gagal memperbarui kategori.'); } 
    finally { setLoading(false); }
  };

  const confirmDelete = (cat) => { setDeleteData(cat); setShowDeleteModal(true); };

  const executeDelete = async () => {
    if (!deleteData) return;
    try {
      await http.delete(`/categories/${deleteData.id}`);
      fetchCategories();
      triggerSuccess('Kategori berhasil dihapus!');
    } catch (err) { alert('Gagal menghapus kategori.'); } 
    finally { setShowDeleteModal(false); setDeleteData(null); }
  };

  const openEditModal = (cat) => { setEditData(cat); setShowEditModal(true); };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2">
        
        {/* FIXED: Diberi margin atas (mt-4) agar kepala maskot ada ruang! */}
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4 mt-4" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '70%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Kelola Kategori</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Buat dan atur pengelompokan produk toko Anda.</p>
          </div>
          <img src={mascotAdmin} alt="Mascot" className="position-absolute d-none d-sm-block" style={{ width: '220px', right: '5%', top: '-45px', zIndex: 5, filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.3))' }} onError={(e) => e.target.style.display='none'} />
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <h5 className="fw-bold mb-3 text-dark">Tambah Kategori</h5>
              <form onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Nama Kategori</label>
                  <input type="text" className="form-control bg-light border-0 p-3 shadow-sm" placeholder="Misal: Olahraga" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Deskripsi (Opsional)</label>
                  <textarea className="form-control bg-light border-0 p-3 shadow-sm" rows="3" placeholder="Deskripsi singkat..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn text-white w-100 fw-bold py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Tambah Kategori'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="bg-white rounded-4 shadow-sm border p-4">
              <h5 className="fw-bold mb-3 text-dark">Daftar Kategori Tersedia</h5>
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border" style={{ color: brandColor }}></div></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 text-nowrap">
                    <thead className="table-light text-secondary small text-uppercase fw-bold">
                      <tr><th className="py-3 border-0">ID</th><th className="py-3 border-0">Nama Kategori</th><th className="py-3 border-0">Deskripsi</th><th className="py-3 text-center border-0">Aksi</th></tr>
                    </thead>
                    <tbody>
                      {categories.length > 0 ? categories.map((cat) => (
                        <tr key={cat.id} className="border-bottom">
                          <td className="fw-bold text-secondary">#{cat.id}</td>
                          <td className="fw-bold text-dark">{cat.name}</td>
                          <td className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{cat.description || '-'}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button onClick={() => openEditModal(cat)} className="btn btn-sm btn-outline-warning fw-bold rounded-pill px-3 hover-scale">Edit</button>
                              <button onClick={() => confirmDelete(cat)} className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3 hover-scale">Hapus</button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" className="text-center py-4 text-muted fw-bold">Belum ada kategori.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editData && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border w-100 shadow-lg" style={{ maxWidth: '450px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-4 text-center">Edit Kategori</h4>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold text-secondary">Nama Kategori</label>
                <input type="text" className="form-control bg-light border-0 p-3 shadow-sm" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} required />
              </div>
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-secondary">Deskripsi</label>
                <textarea className="form-control bg-light border-0 p-3 shadow-sm" rows="3" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})}></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-light fw-bold w-50 py-3 rounded-pill text-secondary border hover-scale">Batal</button>
                <button type="submit" className="btn text-white fw-bold w-50 py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }} disabled={loading}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteData && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-2">Hapus Kategori?</h4>
            <p className="text-secondary small mb-4 px-2">Yakin ingin menghapus kategori <b>{deleteData.name}</b>? Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="d-flex gap-2">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="btn btn-light fw-bold w-100 rounded-pill text-secondary border hover-scale">Batal</button>
              <button type="button" onClick={executeDelete} className="btn btn-danger fw-bold w-100 rounded-pill shadow-sm hover-scale">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {successPopup.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border w-100 text-center shadow-lg" style={{ maxWidth: '350px', borderRadius: '24px' }}>
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Sukses!</h4><p className="text-secondary small mb-4">{successPopup.message}</p>
            <button onClick={() => setSuccessPopup({ show: false, message: '' })} className="btn text-white fw-bold w-100 py-3 rounded-pill shadow-sm" style={{ backgroundColor: brandColor }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;