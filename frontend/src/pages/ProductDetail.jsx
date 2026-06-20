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

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/500?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('/products/')) return imagePath.split('/uploads/').pop();
    return `http://localhost:8000${imagePath}`;
  };

  const decreaseQuantity = () => {
    if (quantity > 1 && !isAdmin) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock && !isAdmin) setQuantity(quantity + 1);
  };

  const handleBuyNowClick = () => {
    if (!token) {
      setAlertModal({
        show: true,
        type: 'error',
        title: 'Akses Dibatasi',
        message: 'Oops! Silakan Login terlebih dahulu untuk melanjutkan proses pembelian.',
        onConfirm: () => {
          setAlertModal(prev => ({ ...prev, show: false }));
          navigate('/login');
        }
      });
    } else {
      setAlertModal({
        show: true,
        type: 'success',
        title: 'Segera Hadir!',
        message: 'Halaman Checkout sedang dalam tahap pengembangan di Sprint 14.',
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
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
      <div className="container mt-2 mb-5">
        <div className="mb-4">
          <Link to="/" className="text-decoration-none text-secondary d-flex align-items-center fw-medium hover-text-brand" style={{ transition: 'color 0.2s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Kembali ke Katalog
          </Link>
        </div>

        <div className="glass-panel p-3 p-md-4 p-lg-5">
          <div className="row g-4 g-lg-5">
            <div className="col-12 col-md-5">
              <div className="rounded-4 overflow-hidden bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1', border: '1px solid rgba(0,0,0,0.05)' }}>
                <img 
                  src={formatImageUrl(product.image_url || product.image)} 
                  alt={product.name} 
                  className="img-fluid w-100 h-100" 
                  style={{ objectFit: 'contain', padding: '1rem' }} 
                />
              </div>
            </div>

            <div className="col-12 col-md-7 d-flex flex-column">
              <span className="badge align-self-start mb-2 rounded-2 px-3 py-2 fw-medium shadow-sm" style={{ backgroundColor: brandColor, color: 'white' }}>
                ID Produk: #{product.id}
              </span>
              
              <h1 className="fw-bolder text-dark mb-2 display-6" style={{ letterSpacing: '-0.5px' }}>{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="text-secondary d-flex align-items-center gap-1 fw-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-danger" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                  {product.location || "Gudang Pusat"}
                </span>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></div>
                <span className="text-secondary fw-medium">Terjual {product.sold || 0}</span>
              </div>

              <h2 className="fw-black mb-4" style={{ color: brandColor, fontSize: '2.5rem' }}>
                Rp {Number(product.price).toLocaleString('id-ID')}
              </h2>

              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Deskripsi Produk</h6>
                <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.95rem' }}>
                  {product.description || "Tidak ada deskripsi rinci untuk produk ini."}
                </p>
              </div>

              <div className="mt-auto bg-light rounded-4 p-4 border shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold text-dark">Kuantitas</span>
                  {isOutOfStock ? (
                    <span className="badge bg-danger text-white blink-animation px-3 py-2 shadow-sm">STOK HABIS</span>
                  ) : (
                    <span className="text-secondary small fw-medium">
                      Tersedia <span className="fw-bold text-dark">{product.stock}</span> buah
                    </span>
                  )}
                </div>

                {/* Menyembunyikan kontrol kuantitas jika Admin atau Habis */}
                {!isOutOfStock && (
                  <div className="d-flex align-items-center gap-3 mb-4 bg-white border rounded-pill px-2 py-1 shadow-sm" style={{ width: 'fit-content', opacity: isAdmin ? 0.6 : 1 }}>
                    <button onClick={decreaseQuantity} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', color: '#475569', cursor: isAdmin ? 'not-allowed' : 'pointer' }} disabled={quantity <= 1 || isAdmin}>
                      <span className="fw-bold fs-5" style={{ marginTop: '-4px' }}>-</span>
                    </button>
                    <span className="fw-bold text-dark fs-5" style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                    <button onClick={increaseQuantity} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', color: '#475569', cursor: isAdmin ? 'not-allowed' : 'pointer' }} disabled={quantity >= product.stock || isAdmin}>
                      <span className="fw-bold fs-5" style={{ marginTop: '-2px' }}>+</span>
                    </button>
                  </div>
                )}

                <div className="row g-3 mt-1">
                  <div className="col-6">
                    <button 
                      className="btn w-100 fw-bold py-2.5 rounded-3 shadow-sm text-truncate"
                      style={{ 
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: (isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor,
                        color: (isOutOfStock || isAdmin) ? '#94a3b8' : brandColor,
                        backgroundColor: 'transparent',
                        cursor: (isOutOfStock || isAdmin) ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem'
                      }}
                      disabled={isOutOfStock || isAdmin}
                      onClick={() => {
                        if (handleAddToCart && !isAdmin) {
                          for(let i = 0; i < quantity; i++) handleAddToCart(product);
                        }
                      }}
                    >
                      {isAdmin ? 'Mode Admin' : (isOutOfStock ? 'Kosong' : '+ Keranjang')}
                    </button>
                  </div>

                  <div className="col-6">
                    <button 
                      className="btn w-100 fw-bold py-2.5 text-white rounded-3 shadow-sm text-truncate"
                      style={{ 
                        background: (isOutOfStock || isAdmin) ? '#cbd5e1' : brandColor,
                        cursor: (isOutOfStock || isAdmin) ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem'
                      }}
                      disabled={isOutOfStock || isAdmin}
                      onClick={handleBuyNowClick}
                    >
                      {isAdmin ? 'Mode Admin' : 'Beli Sekarang'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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