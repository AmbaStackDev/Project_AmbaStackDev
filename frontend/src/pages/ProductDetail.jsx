import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { getProductById } from '../utils/productApi';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mengambil fungsi keranjang yang dioper dari App.jsx melalui MainLayout
  const { handleAddToCart } = useOutletContext(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const brandColor = '#03AC0E'; // AmbaGreen Konsisten

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
    const cleanPath = imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
    return `http://localhost:8000${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
        <div className="spinner-border mb-3" style={{ color: brandColor, width: '3rem', height: '3rem' }}></div>
        <h5 className="fw-bold text-secondary">Menyiapkan Etalase...</h5>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
        <h1 className="fw-black text-dark mb-2" style={{ fontSize: '4rem' }}>🛒</h1>
        <h3 className="fw-bold text-dark mb-3">Oops! Produk Tidak Ditemukan</h3>
        <p className="text-secondary mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ background: brandColor }}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-vh-100 pb-5 bg-white">
      
      {/* BREADCRUMB NAVIGASI & TOMBOL BACK UTAMA */}
      <div className="border-bottom py-3 mb-4 bg-white">
        <div className="container px-3 px-md-4 d-flex align-items-center gap-3">
          {/* PERBAIKAN: Tombol Back berupa Ikon Solid Bulat Premium */}
          <button 
            onClick={() => navigate(-1)}
            className="btn p-0 d-flex align-items-center justify-content-center rounded-circle border shadow-sm bg-white"
            style={{ width: '36px', height: '36px', transition: 'all 0.2s', cursor: 'pointer' }}
            title="Kembali ke halaman sebelumnya"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = brandColor}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#212529" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
          </button>

          <nav aria-label="breadcrumb" className="w-100">
            <ol className="breadcrumb mb-0 small fw-bold">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">AmbaCart</Link></li>
              <li className="breadcrumb-item"><span className="text-muted">Katalog</span></li>
              <li className="breadcrumb-item active" style={{ color: brandColor }} aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container px-3 px-md-4">
        <div className="p-3 p-md-4 rounded-4 shadow-sm border" style={{ backgroundColor: '#ffffff', borderColor: '#f1f1f1' }}>
          <div className="row g-4 g-lg-5">
            
            {/* GAMBAR PRODUK */}
            <div className="col-12 col-md-5">
              <div className="position-relative rounded-4 overflow-hidden border bg-light" style={{ aspectRatio: '1/1' }}>
                <img 
                  src={formatImageUrl(product.image || product.image_url)} 
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                {isOutOfStock && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)' }}>
                    <span className="badge bg-danger text-white fs-5 py-2 px-4 shadow-lg rounded-pill" style={{ transform: 'rotate(-5deg)' }}>HABIS TERJUAL</span>
                  </div>
                )}
              </div>
            </div>

            {/* INFORMASI PRODUK */}
            <div className="col-12 col-md-7 d-flex flex-column">
              <h2 className="fw-black text-dark mb-2 lh-sm">{product.name}</h2>
              
              <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-geo-alt-fill me-1 text-danger" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg> 
                  {product.location || 'Gudang Pusat'}
                </span>
                <span className={`badge px-3 py-2 rounded-pill border ${isOutOfStock ? 'bg-danger bg-opacity-10 text-danger border-danger' : 'bg-success bg-opacity-10 border-success'}`} style={{ color: isOutOfStock ? '' : brandColor }}>
                  {isOutOfStock ? 'Stok Habis' : `Sisa Stok: ${product.stock} Pcs`}
                </span>
              </div>

              <h1 className="fw-black mb-4" style={{ color: brandColor, fontSize: '2.5rem' }}>
                Rp {Number(product.price).toLocaleString('id-ID')}
              </h1>

              {/* DESKRIPSI */}
              <div className="mb-4 flex-grow-1">
                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Detail & Spesifikasi</h6>
                <p className="text-secondary lh-lg" style={{ textAlign: 'justify' }}>
                  {product.description || `Dapatkan ${product.name} dengan kualitas terbaik dan harga terjangkau hanya di AmbaCart. Barang dikirim dengan aman langsung dari lokasi pusat ${product.location}. Jaminan pengemasan rapi dan pelayanan prima untuk setiap transaksi Anda.`}
                </p>
              </div>

              {/* KOTAK KONTROL TRANSAKSI MODEREN */}
              <div className="p-3 p-md-4 rounded-4 mt-auto" style={{ backgroundColor: '#f0fdf4', border: `1px solid ${brandColor}30` }}>
                
                {/* Bagian Pengatur Kuantitas (Dipisah di baris atas agar rapi) */}
                <div className="mb-3" style={{ maxWidth: '140px' }}>
                  <label className="small gap-1 fw-bold text-secondary mb-1 d-block">Jumlah</label>
                  <div className="input-group input-group-sm shadow-sm border rounded-3 overflow-hidden">
                    <button className="btn btn-light bg-white text-dark fw-bold border-0" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={isOutOfStock}>-</button>
                    <input type="text" className="form-control text-center fw-bold border-0 bg-white p-0" value={isOutOfStock ? 0 : quantity} readOnly style={{ width: '40px' }} />
                    <button className="btn btn-light bg-white text-dark fw-bold border-0" type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={isOutOfStock}>+</button>
                  </div>
                </div>

                {/* PERBAIKAN: Baris Aksi Bersebelahan dengan Ukuran Sama Rata (col-6) */}
                <div className="row g-2">
                  
                  {/* Tombol Tambah Keranjang */}
                  <div className="col-6">
                    <button 
                      className="btn w-100 fw-bold shadow-sm py-2.5 rounded-3 text-truncate" 
                      style={{ 
                        background: isOutOfStock ? '#e9ecef' : 'transparent', 
                        color: isOutOfStock ? '#adb5bd' : brandColor,
                        border: isOutOfStock ? 'none' : `2px solid ${brandColor}`,
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem'
                      }}
                      disabled={isOutOfStock}
                      onClick={() => {
                        if (handleAddToCart) {
                          for(let i = 0; i < quantity; i++) handleAddToCart(product);
                        }
                      }}
                    >
                      {isOutOfStock ? 'Kosong' : '+ Keranjang'}
                    </button>
                  </div>

                  {/* Tombol Beli Sekarang */}
                  <div className="col-6">
                    <button 
                      className="btn w-100 fw-bold py-2.5 text-white rounded-3 shadow-sm text-truncate"
                      style={{ 
                        background: isOutOfStock ? '#cbd5e1' : brandColor,
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem'
                      }}
                      disabled={isOutOfStock}
                    //   onClick={() => alert("Sesuai batas Sprint 12, sistem checkout pembelian langsung akan diaktifkan pada tahapan sprint berikutnya!")}
                    >
                      Beli Sekarang
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;