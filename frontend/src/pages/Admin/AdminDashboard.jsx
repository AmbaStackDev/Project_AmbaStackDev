import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { getProducts, deleteProduct } from '../../utils/productApi';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotAdmin from '../../assets/mascotadmin.png'; 
import http from '../../utils/http';

function AdminDashboard({ showToast }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); 
  const [sortOrder, setSortOrder] = useState('NEWEST'); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const brandColor = '#03AC0E';

  const sortOptions = [
    { value: 'NEWEST', label: 'Terbaru' },
    { value: 'PRICE_DESC', label: 'Harga Tertinggi' },
    { value: 'PRICE_ASC', label: 'Harga Terendah' },
    { value: 'STOCK_DESC', label: 'Stok Terbanyak' }
  ];

  const fetchData = async () => {
    try {
      const prodRes = await getProducts();
      setProducts(prodRes.data.data); 
      
      const ordRes = await http.get('/orders/admin/all');
      if (ordRes.data.success) setOrders(ordRes.data.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const triggerDeleteModal = (product) => { setProductToDelete(product); setShowModal(true); };

  const executeDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      if (showToast) showToast("Produk berhasil dihapus!");
      fetchData();
    } catch (error) { alert("Gagal menghapus produk."); } 
    finally { setShowModal(false); setProductToDelete(null); }
  };

  let processedProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  if (filterTab === 'LOW') processedProducts = processedProducts.filter(p => p.stock > 0 && p.stock <= 5);
  if (filterTab === 'EMPTY') processedProducts = processedProducts.filter(p => p.stock <= 0);

  processedProducts.sort((a, b) => {
    if (sortOrder === 'NEWEST') return b.id - a.id;
    if (sortOrder === 'PRICE_ASC') return a.price - b.price;
    if (sortOrder === 'PRICE_DESC') return b.price - a.price;
    if (sortOrder === 'STOCK_DESC') return b.stock - a.stock;
    return 0;
  });

  const handleExportCSV = () => {
    const headers = "ID,Nama Produk,Harga (Rp),Stok (Pcs),Lokasi\n";
    const csvData = products.map(p => `${p.id},"${p.name}",${p.price},${p.stock},"${p.location}"`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Stok_AmbaCart_${new Date().toLocaleDateString('id-ID')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    if (showToast) showToast("Laporan CSV berhasil diunduh!");
  };

  // FIXED: Format Image URL agar Dummy / Upload ter-load sempurna!
  const formatImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/55?text=No+Image';
    if (img.startsWith('http')) return img;
    if (img.includes('/products/')) return img.substring(img.indexOf('/products/')); 
    if (img.startsWith('/uploads/')) return `http://127.0.0.1:8000${img}`;
    return `http://127.0.0.1:8000/uploads/${img}`;
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8f9fa', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />

      <div className="container px-3" style={{ marginTop: '5rem' }}>
        
        {/* BANNER 3D POP-OUT */}
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '65%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Dashboard Admin</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Pantau status pesanan dan sisa stok toko Anda dengan mudah.</p>
          </div>
          <img src={mascotAdmin} alt="Mascot" className="position-absolute d-none d-sm-block" style={{ width: '260px', right: '5%', top: '-75px', zIndex: 5, filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.4))' }} />
        </div>

        {/* KARTU RINGKASAN PESANAN DENGAN ICON SOLID */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-lg-3">
             <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-warning h-100 hover-scale cursor-pointer d-flex justify-content-between align-items-center" onClick={() => window.location.href='/admin/orders'}>
                <div>
                  <span className="text-secondary small fw-bold d-block mb-1">Perlu Dikirim</span>
                  <h3 className="fw-black text-dark mb-0">{orders.filter(o => o.status === 'PENDING').length}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning d-none d-md-flex align-items-center justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.958l-7.19 2.876a1.5 1.5 0 0 1-1.162 0l-7.19-2.876A1 1 0 0 1 0 12.162V3.5a.5.5 0 0 1 .314-.464z"/></svg>
                </div>
             </div>
          </div>
          <div className="col-6 col-lg-3">
             <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-info h-100 hover-scale cursor-pointer d-flex justify-content-between align-items-center" onClick={() => window.location.href='/admin/orders'}>
                <div>
                  <span className="text-secondary small fw-bold d-block mb-1">Sedang Dikirim</span>
                  <h3 className="fw-black text-dark mb-0">{orders.filter(o => ['SHIPPED','ARRIVED'].includes(o.status)).length}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info d-none d-md-flex align-items-center justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
                </div>
             </div>
          </div>
          <div className="col-6 col-lg-3">
             <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-success h-100 hover-scale cursor-pointer d-flex justify-content-between align-items-center" onClick={() => window.location.href='/admin/orders'}>
                <div>
                  <span className="text-secondary small fw-bold d-block mb-1">Pesanan Selesai</span>
                  <h3 className="fw-black text-dark mb-0">{orders.filter(o => o.status === 'DELIVERED').length}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success d-none d-md-flex align-items-center justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                </div>
             </div>
          </div>
          <div className="col-6 col-lg-3">
             <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-danger h-100 hover-scale cursor-pointer d-flex justify-content-between align-items-center" onClick={() => window.location.href='/admin/orders'}>
                <div>
                  <span className="text-secondary small fw-bold d-block mb-1">Batal / Refund</span>
                  <h3 className="fw-black text-dark mb-0">{orders.filter(o => ['CANCELLED','RETURNED','REFUNDED','REFUND_REJECTED'].includes(o.status)).length}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger d-none d-md-flex align-items-center justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                </div>
             </div>
          </div>
        </div>

        {/* BARIS KONTROL PRODUK */}
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 mb-4">
          <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
            <input type="text" className="form-control p-3 border-0 shadow-sm rounded-4" placeholder="Cari nama produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start justify-content-xl-end">
            <div className="btn-group bg-white p-1 rounded-4 shadow-sm me-md-2">
              <button onClick={() => setFilterTab('ALL')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'ALL' ? 'text-white' : 'text-secondary'}`} style={{ backgroundColor: filterTab === 'ALL' ? brandColor : 'transparent', border: 'none' }}>Semua</button>
              <button onClick={() => setFilterTab('LOW')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'LOW' ? 'btn-warning text-dark' : 'text-secondary'}`} style={{ border: 'none' }}>Menipis</button>
              <button onClick={() => setFilterTab('EMPTY')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'EMPTY' ? 'btn-danger text-white' : 'text-secondary'}`} style={{ border: 'none' }}>Habis</button>
            </div>

            <div className="position-relative" style={{ minWidth: '220px' }}>
              <div className="bg-white px-3 py-2 rounded-4 shadow-sm d-flex align-items-center justify-content-between" style={{ border: `1px solid ${brandColor}50`, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div><span className="text-secondary small fw-bold me-2">Urutkan:</span><span className="fw-bold" style={{ color: brandColor }}>{sortOptions.find(opt => opt.value === sortOrder)?.label}</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill={brandColor} viewBox="0 0 16 16" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
              </div>

              {isDropdownOpen && (
                <div className="position-absolute bg-white rounded-4 shadow border-0 mt-2 w-100 overflow-hidden py-2" style={{ zIndex: 1050, top: '100%', right: 0 }}>
                  {sortOptions.map(option => (
                    <div key={option.value} className="px-3 py-2 fw-bold text-secondary" style={{ cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: sortOrder === option.value ? `${brandColor}15` : 'transparent', color: sortOrder === option.value ? brandColor : '#6c757d' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = `${brandColor}20`; e.currentTarget.style.color = brandColor; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = sortOrder === option.value ? `${brandColor}15` : 'transparent'; e.currentTarget.style.color = sortOrder === option.value ? brandColor : '#6c757d'; }} onClick={() => { setSortOrder(option.value); setIsDropdownOpen(false); }}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleExportCSV} className="btn fw-bold shadow-sm rounded-4 px-4 py-2 text-white ms-md-2" style={{ background: brandColor, border: 'none' }}>Download CSV</button>
          </div>
        </div>

        {/* TABEL DATA */}
        {loading ? (
          <div className="text-center mt-5"><div className="spinner-border" style={{ color: brandColor }}></div></div>
        ) : (
          <div className="table-responsive bg-white rounded-4 shadow-sm p-2 p-md-3 border-0">
            <table className="table table-hover align-middle mb-0 text-nowrap text-md-wrap bg-white">
              <thead className="text-secondary small text-uppercase fw-bold">
                <tr><th className="border-0 bg-white">Gambar</th><th className="border-0 bg-white">Nama Produk</th><th className="border-0 bg-white">Harga</th><th className="border-0 bg-white text-center">Stok</th><th className="border-0 bg-white">Lokasi</th><th className="border-0 bg-white text-center">Aksi</th></tr>
              </thead>
              <tbody>
                {processedProducts.length > 0 ? (
                  processedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="bg-white"><img src={formatImageUrl(product.image || product.image_url)} alt={product.name} className="shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=X'; }} /></td>
                      <td className="bg-white fw-bold text-dark">{product.name}</td>
                      <td className="bg-white fw-bold" style={{ color: brandColor }}>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                      <td className="bg-white text-center">{product.stock > 0 ? (<span className={`badge px-3 py-1.5 rounded-pill ${product.stock <= 5 ? 'bg-warning text-dark' : 'bg-success text-white'}`} style={{ backgroundColor: product.stock > 5 ? brandColor : '' }}>{product.stock}</span>) : (<span className="badge bg-danger text-white px-3 py-1.5 rounded-pill">HABIS</span>)}</td>
                      <td className="bg-white text-secondary fw-medium">{product.location}</td>
                      <td className="bg-white text-center"><div className="d-flex justify-content-center gap-2"><Link to={`/admin/edit/${product.id}`} className="btn btn-sm btn-outline-warning fw-bold px-3 py-1.5 rounded-3">Edit</Link><button onClick={() => triggerDeleteModal(product)} className="btn btn-sm btn-outline-danger fw-bold px-3 py-1.5 rounded-3">Hapus</button></div></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="bg-white text-center py-5 text-muted fw-medium">Produk kosong atau filter tidak menemukan hasil.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-4 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <h4 className="fw-bold text-dark mb-2">Hapus Produk?</h4><p className="text-secondary small mb-4 px-2">Yakin ingin menghapus <b>{productToDelete?.name}</b>? Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="d-flex gap-2"><button onClick={() => setShowModal(false)} className="btn btn-light fw-bold w-100 rounded-3 text-secondary border">Batal</button><button onClick={executeDelete} className="btn btn-danger fw-bold w-100 rounded-3 shadow-sm">Ya, Hapus</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;