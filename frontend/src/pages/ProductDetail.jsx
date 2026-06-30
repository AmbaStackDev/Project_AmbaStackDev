import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { getProductById } from '../utils/productApi';
import { AuthContext } from '../context/AuthContext'; 
import AuthAlertModal from '../components/Modal/AuthAlertModal'; 

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { handleAddToCart } = useOutletContext(); 
  const { token } = useContext(AuthContext); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const brandColor = '#03AC0E'; 

  const [alertModal, setAlertModal] = useState({
    show: false, type: 'error', title: '', message: '', onConfirm: null
  });

  // STRICT MODE: Ekstraksi Role dari Token
  let userRole = 'customer';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role || 'customer';
    } catch (e) {}
  }
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (err) {
        setError("Gagal memuat detail produk. Barang mungkin sudah dihapus atau tidak tersedia.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // LOGIKA GAMBAR CERDAS: Menggabungkan Dunia Frontend dan Backend!
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/500?text=No+Image';
    // Jika gambar dari internet/URL luar
    if (imagePath.startsWith('http')) return imagePath;
    // Jika gambar dari Seeder (Frontend Public Folder)
    if (imagePath.startsWith('/products/')) return imagePath; 
    // Jika gambar dari Upload Admin (Backend Uploads Folder)
    if (imagePath.startsWith('/uploads/')) return `http://127.0.0.1:8000${imagePath}`;
    // Fallback jika hanya nama file yang tersimpan
    return `http://127.0.0.1:8000/uploads/${imagePath}`;
  };

  const decreaseQuantity = () => {
    if (quantity > 1 && !isAdmin) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock && !isAdmin) setQuantity(quantity + 1);
  };

  // LOGIKA JALUR BELAKANG: Beli Sekarang (Direct Checkout TANPA menyentuh Keranjang Utama)
  const handleBuyNowClick = (e) => {
    e.preventDefault(); // Mencegah form/link bubbling
    if (!token) {
      setAlertModal({
        show: true, type: 'error', title: 'Akses Dibatasi',
        message: 'Oops! Silakan Login terlebih dahulu untuk melanjutkan proses pembelian.',
        onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); navigate('/login'); }
      });
    } else {
      if (!isAdmin) {
        // Melempar data produk INI SAJA secara rahasia ke halaman checkout
        // Syarat: Halaman Checkout harus sudah di-update untuk menerima location.state!
        navigate('/checkout', { state: { directBuyItem: { ...product, quantity } } });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-brand" style={{ width: '3rem', height: '3rem', color: brandColor }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h4 className="text-danger fw-bold mb-3">{error || "Produk tidak ditemukan"}</h4>
        <Link to="/" className="btn btn-outline-secondary fw-bold px-4 py-2 rounded-3">Kembali ke Beranda</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <>
      {/* pb-5 & pb-md-0 untuk memberi ruang pada Mobile Sticky Bar agar tidak tertutup */}
      <div className="container mt-2 mb-5 pb-5 pb-md-0"> 
        <div className="mb-4">
          <Link to="/" className="text-decoration-none text-secondary d-flex align-items-center fw-bold hover-text-brand" style={{ transition: 'color 0.2s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* GLASS PANEL UI MEWAH */}
        <div className="glass-panel p-3 p-md-4 p-lg-5 shadow-sm border rounded-4 bg-white">
          <div className="row g-4 g-lg-5">
            
            {/* GAMBAR PRODUK */}
            <div className="col-12 col-md-5">
              <div className="rounded-4 overflow-hidden bg-light shadow-sm d-flex align-items-center justify-content-center border" style={{ aspectRatio: '1/1' }}>
                <img 
                  src={formatImageUrl(product.image_url || product.image)} 
                  alt={product.name} 
                  className="img-fluid w-100 h-100" 
                  style={{ objectFit: 'contain', padding: '1rem' }} 
                />
              </div>
            </div>

            {/* DETAIL PRODUK */}
            <div className="col-12 col-md-7 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge align-self-start rounded-pill px-3 py-2 fw-bold shadow-sm bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">
                  🔥 Promo Spesial
                </span>
                
              </div>
              
              <h1 className="fw-black text-dark mb-2 fs-3 fs-md-2" style={{ letterSpacing: '-0.5px', lineHeight: '1.2' }}>{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-4 small">
                <span className="text-success d-flex align-items-center gap-1 fw-bold">
                  {/* SOLID ICON: Location */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  {product.location || "Gudang Pusat"}
                </span>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></div>
                <span className="text-secondary fw-medium">Terjual <span className="text-dark fw-bold">{product.sold || 0}</span></span>
              </div>

              <h2 className="fw-black mb-4" style={{ color: brandColor, fontSize: '2.2rem' }}>
                Rp {Number(product.price).toLocaleString('id-ID')}
              </h2>

              <div className="mb-4 bg-light p-3 p-md-4 rounded-4 border">
                <h6 className="fw-bold text-dark mb-2">Deskripsi Produk</h6>
                <p className="text-secondary lh-lg mb-0 small" style={{ fontSize: '0.95rem' }}>
                  {product.description || "Tidak ada deskripsi rinci untuk produk ini."}
                </p>
              </div>

              {/* KONTROL & TOMBOL (KHUSUS DESKTOP) */}
              <div className="mt-auto bg-white rounded-4 p-4 border shadow-sm d-none d-md-block">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold text-dark">Atur Kuantitas</span>
                  {isOutOfStock ? (
                    <span className="badge bg-danger text-white blink-animation px-3 py-2 shadow-sm">STOK HABIS</span>
                  ) : (
                    <span className="text-secondary small fw-medium">
                      Tersedia <span className="fw-bold text-dark">{product.stock}</span> buah
                    </span>
                  )}
                </div>

                {!isOutOfStock && (
                  <div className="d-flex align-items-center gap-3 mb-4 bg-white border rounded-pill px-2 py-1 shadow-sm" style={{ width: 'fit-content', opacity: isAdmin ? 0.6 : 1 }}>
                    <button type="button" onClick={decreaseQuantity} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-dark" style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', cursor: isAdmin ? 'not-allowed' : 'pointer' }} disabled={quantity <= 1 || isAdmin}>
                      <span className="fw-bold fs-5" style={{ marginTop: '-4px' }}>-</span>
                    </button>
                    <span className="fw-bold text-dark fs-5" style={{ minWidth: '35px', textAlign: 'center' }}>{quantity}</span>
                    <button type="button" onClick={increaseQuantity} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-dark" style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', cursor: isAdmin ? 'not-allowed' : 'pointer' }} disabled={quantity >= product.stock || isAdmin}>
                      <span className="fw-bold fs-5" style={{ marginTop: '-2px' }}>+</span>
                    </button>
                  </div>
                )}

                <div className="row g-3 mt-1">
                  <div className="col-6">
                    <button 
                      type="button"
                      className="btn w-100 fw-bold py-2.5 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale"
                      style={{ 
                        border: `2px solid ${(isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor}`,
                        color: (isOutOfStock || isAdmin) ? '#94a3b8' : brandColor,
                        backgroundColor: 'transparent', cursor: (isOutOfStock || isAdmin) ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isOutOfStock || isAdmin}
                      onClick={(e) => {
                        e.preventDefault();
                        if (handleAddToCart && !isAdmin) {
                          for(let i = 0; i < quantity; i++) handleAddToCart(product);
                        }
                      }}
                    >
                      {/* SOLID ICON: Cart */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                      {isAdmin ? 'Mode Admin' : (isOutOfStock ? 'Stok Habis' : 'Keranjang')}
                    </button>
                  </div>

                  <div className="col-6">
                    <button 
                      type="button"
                      className="btn w-100 fw-bold py-2.5 text-white rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale"
                      style={{ 
                        background: (isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor,
                        cursor: (isOutOfStock || isAdmin) ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isOutOfStock || isAdmin}
                      onClick={handleBuyNowClick}
                    >
                      {/* SOLID ICON: Bag */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm0 6.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 .5.5z"/></svg>
                      {isAdmin ? 'Mode Admin' : 'Beli Sekarang'}
                    </button>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY ACTION BAR (KHUSUS MOBILE/HP) - UX E-commerce Premium */}
      <div className="d-md-none fixed-bottom bg-white border-top p-3 shadow-lg d-flex flex-column gap-2" style={{ zIndex: 1040, borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center mb-1 px-1">
          <span className="fw-bold small text-secondary">Atur Jumlah</span>
          <div className="d-flex align-items-center border rounded-pill px-1 py-1 shadow-sm">
            <button type="button" onClick={decreaseQuantity} className="btn btn-sm text-secondary fw-bold d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '32px', height: '32px' }} disabled={isOutOfStock || isAdmin}>-</button>
            <span className="fw-bold text-dark mx-3 small">{quantity}</span>
            <button type="button" onClick={increaseQuantity} className="btn btn-sm text-secondary fw-bold d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '32px', height: '32px' }} disabled={isOutOfStock || isAdmin}>+</button>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            type="button"
            className="btn fw-bold py-2 rounded-pill flex-fill small d-flex align-items-center justify-content-center gap-2" 
            style={{ border: `1.5px solid ${(isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor}`, color: (isOutOfStock || isAdmin) ? '#94a3b8' : brandColor, backgroundColor: 'white' }} 
            disabled={isOutOfStock || isAdmin} 
            onClick={(e) => {
              e.preventDefault();
              if (handleAddToCart && !isAdmin) {
                for(let i = 0; i < quantity; i++) handleAddToCart(product);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
            Keranjang
          </button>
          <button 
            type="button"
            className="btn fw-bold py-2 text-white rounded-pill flex-fill small shadow-sm hover-scale d-flex align-items-center justify-content-center gap-2" 
            style={{ backgroundColor: (isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor }} 
            disabled={isOutOfStock || isAdmin} 
            onClick={handleBuyNowClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A.5.5 0 0 1 8 1zm0 6.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 .5.5z"/></svg>
            Beli Sekarang
          </button>
        </div>
      </div>

      <AuthAlertModal 
        show={alertModal.show} 
        type={alertModal.type} 
        title={alertModal.title} 
        message={alertModal.message} 
        onClose={alertModal.onConfirm} 
      />
    </>
  );
}

export default ProductDetail;