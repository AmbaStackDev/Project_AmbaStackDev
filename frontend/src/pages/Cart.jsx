import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const brandColor = '#03AC0E';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('amba_cart')) || [];
    setCartItems(savedCart);
  }, []);

  // FIXED: Fungsi untuk menambah/mengurangi barang dari dalam Cart
  const updateQuantity = (id, newQuantity, stockLmt) => {
    if (newQuantity <= 0) {
      handleRemove(id); // FIXED: Jika 0, otomatis hapus dari keranjang!
      return;
    }
    if (stockLmt && newQuantity > stockLmt) {
      // FIXED: Munculkan popup jika mencoba melampaui stok!
      setAlertModal({
        show: true, type: 'error', title: 'Stok Terbatas',
        message: `Maaf, toko hanya memiliki ${stockLmt} stok untuk barang ini.`,
        onConfirm: () => setAlertModal(prev => ({ ...prev, show: false }))
      });
      return;
    }

    const newCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newCart);
    localStorage.setItem('amba_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartChanged')); // Update navbar
  };

  const handleRemove = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('amba_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartChanged')); // Update navbar
  };

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    navigate('/checkout'); 
  };

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('/products/')) return imagePath.split('/uploads/').pop();
    return `http://127.0.0.1:8000${imagePath}`;
  };

  return (
    <div className="container mt-4 mb-5 min-vh-100">
      <h2 className="fw-black mb-4 text-dark d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="me-3" style={{color: brandColor}} viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        Keranjang Belanjaku
      </h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 mt-4 border shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16">
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
          </svg>
          <h4 className="text-dark fw-bold mb-2">Keranjangmu masih kosong nih!</h4>
          <p className="text-muted mb-4">Yuk, cari barang-barang impianmu dan masukkan ke sini.</p>
          <Link to="/" className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm hover-scale" style={{backgroundColor: brandColor}}>Mulai Belanja Sekarang</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h6 className="mb-0 fw-bold text-secondary">Daftar Produk ({cartItems.length})</h6>
              </div>
              <div className="card-body p-0">
                {cartItems.map((item, index) => (
                  <div className={`p-3 p-md-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`} key={item.id}>
                    
                    {/* GAMBAR PRODUK */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0 mb-3 mb-sm-0 me-sm-4 bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden border hover-scale" style={{ width: '100px', height: '100px' }}>
                      <img src={formatImageUrl(item.image_url || item.image)} alt={item.name} className="img-fluid" style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%', padding: '5px' }} />
                    </Link>

                    {/* DETAIL PRODUK */}
                    <div className="flex-grow-1 w-100">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <Link to={`/product/${item.id}`} className="text-decoration-none">
                          <h6 className="fw-bold mb-1 text-dark" style={{ transition: 'color 0.2s', lineHeight: '1.4' }} onMouseOver={e => e.currentTarget.style.color = brandColor} onMouseOut={e => e.currentTarget.style.color = '#212529'}>
                            {item.name}
                          </h6>
                        </Link>
                        <span className="fw-black ms-3 fs-5" style={{ color: brandColor, whiteSpace: 'nowrap' }}>
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                      
                      <p className="text-secondary mb-3 small fw-medium">Rp {Number(item.price).toLocaleString('id-ID')} / barang</p>
                      
                      {/* KONTROL KUANTITAS & HAPUS */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center bg-white border rounded-pill px-1 py-1 shadow-sm" style={{ width: 'fit-content' }}>
                          
                          {/* FIXED: Hapus atribut disabled agar angka bisa turun ke 0 dan otomatis menghapus barang */}
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', backgroundColor: '#f1f5f9', color: '#475569' }}>
                            <span className="fw-bold fs-5" style={{ marginTop: '-4px' }}>-</span>
                          </button>
                          
                          <span className="fw-bold text-dark mx-2 small" style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                          
                          {/* FIXED: Tambahkan item.stock sebagai parameter ketiga agar peringatan batas stok memicu popup */}
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)} className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', backgroundColor: '#f1f5f9', color: '#475569' }}>
                            <span className="fw-bold fs-5" style={{ marginTop: '-2px' }}>+</span>
                          </button>
                          
                        </div>

                        <button onClick={() => handleRemove(item.id)} className="btn btn-link text-danger p-0 text-decoration-none d-flex align-items-center hover-scale">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                          <span className="small fw-bold">Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY BELANJA */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-4 border-0 rounded-4 bg-white sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold border-bottom pb-3 mb-3">Ringkasan Belanja</h5>
              
              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Total Barang</span>
                <span className="fw-medium">{cartItems.reduce((a, b) => a + b.quantity, 0)} Pcs</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary fw-medium">Subtotal Harga</span>
                <span className="fw-black fs-5" style={{color: brandColor}}>Rp {calculateTotal().toLocaleString('id-ID')}</span>
              </div>
              
              <hr className="my-2 mb-4 text-secondary" />

              <button onClick={handleCheckout} className="btn w-100 text-white fw-bold py-3 rounded-pill shadow-sm hover-scale" style={{backgroundColor: brandColor}}>
                Beli Sekarang ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </button>
              
              <p className="text-center small text-muted mt-3 mb-0">Ongkos kirim akan dihitung di tahap Checkout.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;