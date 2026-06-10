import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { getProducts, deleteProduct } from '../../utils/productApi';
import mascotAdmin from '../../assets/mascotadmin.png'; 
import logoImg from '../../assets/logo.png';

function AdminDashboard({ showToast }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); 
  const [sortOrder, setSortOrder] = useState('NEWEST'); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const brandColor = '#03AC0E';

  const sortOptions = [
    { value: 'NEWEST', label: 'Terbaru' },
    { value: 'PRICE_DESC', label: 'Harga Tertinggi' },
    { value: 'PRICE_ASC', label: 'Harga Terendah' },
    { value: 'STOCK_DESC', label: 'Stok Terbanyak' }
  ];

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data); 
    } catch (error) {
      console.error("Gagal memuat data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const triggerDeleteModal = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      if (showToast) showToast("Produk berhasil dihapus!");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk.");
    } finally {
      setShowModal(false);
      setProductToDelete(null);
    }
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

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/55?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('/products/')) return imagePath.split('/uploads/').pop();
    const cleanPath = imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
    return `http://localhost:8000${cleanPath}`;
  };

  const executeLogout = () => {
    localStorage.removeItem('token');
    if (showToast) showToast("Berhasil Logout dari sesi admin.");
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
            <Link to="/admin" className="nav-link-active">Dashboard</Link>
            
            {/* TOMBOL WARNA 100% AMBAGREEN */}
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

      <div className="container px-3" style={{ marginTop: '5rem' }}>
        
        {/* BANNER 3D POP-OUT DESAIN BARU */}
        <div className="rounded-4 shadow-sm position-relative border-0 mb-5" 
             style={{ 
               background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', 
               color: 'white',
             }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '65%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Dashboard Admin</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Kelola daftar produk dan sisa stok toko Anda dengan mudah.</p>
          </div>
          
          <img 
            src={mascotAdmin} 
            alt="Mascot" 
            className="position-absolute d-none d-sm-block" 
            style={{ 
              width: '260px', 
              right: '5%', 
              top: '-75px', 
              zIndex: 5,
              filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.4))' 
            }} 
          />
        </div>

        {/* BARIS KONTROL */}
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 mb-4">
          
          <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
            <input 
              type="text" 
              className="form-control p-3 border-0 shadow-sm rounded-4" 
              placeholder="Cari nama produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start justify-content-xl-end">
            
            <div className="btn-group bg-white p-1 rounded-4 shadow-sm me-md-2">
              <button onClick={() => setFilterTab('ALL')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'ALL' ? 'text-white' : 'text-secondary'}`} style={{ backgroundColor: filterTab === 'ALL' ? brandColor : 'transparent', border: 'none' }}>Semua</button>
              <button onClick={() => setFilterTab('LOW')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'LOW' ? 'btn-warning text-dark' : 'text-secondary'}`} style={{ border: 'none' }}>Menipis</button>
              <button onClick={() => setFilterTab('EMPTY')} className={`btn btn-sm fw-bold rounded-pill px-3 ${filterTab === 'EMPTY' ? 'btn-danger text-white' : 'text-secondary'}`} style={{ border: 'none' }}>Habis</button>
            </div>

            {/* CUSTOM REACT DROPDOWN */}
            <div className="position-relative" style={{ minWidth: '220px' }}>
              <div 
                className="bg-white px-3 py-2 rounded-4 shadow-sm d-flex align-items-center justify-content-between" 
                style={{ border: `1px solid ${brandColor}50`, cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div>
                  <span className="text-secondary small fw-bold me-2">Urutkan:</span>
                  <span className="fw-bold" style={{ color: brandColor }}>
                    {sortOptions.find(opt => opt.value === sortOrder)?.label}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill={brandColor} viewBox="0 0 16 16" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>

              {isDropdownOpen && (
                <div 
                  className="position-absolute bg-white rounded-4 shadow border-0 mt-2 w-100 overflow-hidden py-2" 
                  style={{ zIndex: 1050, top: '100%', right: 0 }}
                >
                  {sortOptions.map(option => (
                    <div
                      key={option.value}
                      className="px-3 py-2 fw-bold text-secondary"
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        backgroundColor: sortOrder === option.value ? `${brandColor}15` : 'transparent',
                        color: sortOrder === option.value ? brandColor : '#6c757d'
                      }}
                      onMouseOver={(e) => { 
                        e.currentTarget.style.backgroundColor = `${brandColor}20`; 
                        e.currentTarget.style.color = brandColor; 
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = sortOrder === option.value ? `${brandColor}15` : 'transparent';
                        e.currentTarget.style.color = sortOrder === option.value ? brandColor : '#6c757d';
                      }}
                      onClick={() => {
                        setSortOrder(option.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleExportCSV} className="btn fw-bold shadow-sm rounded-4 px-4 py-2 text-white ms-md-2" style={{ background: brandColor, border: 'none' }}>
              Download CSV
            </button>

          </div>
        </div>

        {/* TABEL DATA */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: brandColor }}></div>
          </div>
        ) : (
          <div className="table-responsive bg-white rounded-4 shadow-sm p-2 p-md-3 border-0">
            <table className="table table-hover align-middle mb-0 text-nowrap text-md-wrap bg-white">
              <thead className="text-secondary small text-uppercase fw-bold">
                <tr>
                  <th className="border-0 bg-white">Gambar</th>
                  <th className="border-0 bg-white">Nama Produk</th>
                  <th className="border-0 bg-white">Harga</th>
                  <th className="border-0 bg-white text-center">Stok</th>
                  <th className="border-0 bg-white">Lokasi</th>
                  <th className="border-0 bg-white text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {processedProducts.length > 0 ? (
                  processedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="bg-white">
                        <img 
                          src={formatImageUrl(product.image || product.image_url)} 
                          alt={product.name} 
                          className="shadow-sm"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=X'; }}
                        />
                      </td>
                      <td className="bg-white fw-bold text-dark">{product.name}</td>
                      <td className="bg-white fw-bold" style={{ color: brandColor }}>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                      <td className="bg-white text-center">
                        {product.stock > 0 ? (
                          <span className={`badge px-3 py-1.5 rounded-pill ${product.stock <= 5 ? 'bg-warning text-dark' : 'bg-success text-white'}`} style={{ backgroundColor: product.stock > 5 ? brandColor : '' }}>
                            {product.stock}
                          </span>
                        ) : (
                          <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill">HABIS</span>
                        )}
                      </td>
                      <td className="bg-white text-secondary fw-medium">{product.location}</td>
                      <td className="bg-white text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Link to={`/admin/edit/${product.id}`} className="btn btn-sm btn-outline-warning fw-bold px-3 py-1.5 rounded-3">Edit</Link>
                          <button onClick={() => triggerDeleteModal(product)} className="btn btn-sm btn-outline-danger fw-bold px-3 py-1.5 rounded-3">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="bg-white text-center py-5 text-muted fw-medium">Produk kosong atau filter tidak menemukan hasil.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL HAPUS PRODUK */}
      {showModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-4 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <div className="mb-3 text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <h4 className="fw-bold text-dark mb-2">Hapus Produk?</h4>
            <p className="text-secondary small mb-4 px-2">Yakin ingin menghapus <b>{productToDelete?.name}</b>? Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="d-flex gap-2">
              <button onClick={() => setShowModal(false)} className="btn btn-light fw-bold w-100 rounded-3 text-secondary border">Batal</button>
              <button onClick={executeDelete} className="btn btn-danger fw-bold w-100 rounded-3 shadow-sm">Ya, Hapus</button>
            </div>
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
            <p className="text-secondary small mb-4 px-2">Anda akan Logout dari sesi administrator. Anda harus login kembali untuk mengelola toko.</p>
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

export default AdminDashboard;