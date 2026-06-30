import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import http from '../utils/http';
import AuthAlertModal from '../components/Modal/AuthAlertModal';

// IMPORT LOGO PEMBAYARAN DARI FOLDER ASSETS
import logoDana from '../assets/dana.svg';
import logoGopay from '../assets/gopay.png';
import logoSeabank from '../assets/seabank.svg';
import logoQris from '../assets/qris.svg';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const brandColor = '#03AC0E';

  const [cartItems, setCartItems] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, type: 'success', title: '', message: '', onConfirm: null });

  const [addressOption, setAddressOption] = useState('profile'); 
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(900);

  const [newAddress, setNewAddress] = useState({
    nama_penerima: '', no_hp: '', provinsi: '', kecamatan: '', kota: '', kode_pos: '', detail: ''
  });

  const isDirectBuy = location.state?.directBuyItem !== undefined;
  const directBuyItem = location.state?.directBuyItem;

  const shippingRates = {
    reguler: { name: 'Reguler (2-4 Hari)', price: 15000 },
    sameday: { name: 'Sameday (6-8 Jam)', price: 30000 },
    instant: { name: 'Instant (2-3 Jam)', price: 50000 },
    cargo: { name: 'Kargo (5-7 Hari)', price: 25000 }
  };

  // DIUPDATE: Menggunakan properti 'image' untuk menampung import gambar asli
  const paymentOptions = [
    { id: 'DANA', name: 'DANA', image: logoDana },
    { id: 'GoPay', name: 'GoPay', image: logoGopay },
    { id: 'SeaBank', name: 'SeaBank', image: logoSeabank },
    { id: 'QRIS', name: 'QRIS', image: logoQris }
  ];

  useEffect(() => {
    if (isDirectBuy && directBuyItem) {
      setCartItems([directBuyItem]);
    } else {
      const savedCart = JSON.parse(localStorage.getItem('amba_cart')) || [];
      if (savedCart.length === 0) navigate('/cart');
      else setCartItems(savedCart);
    }
    fetchProfile();
  }, [navigate, isDirectBuy, directBuyItem]);

  useEffect(() => {
    let timer;
    if (showPaymentGateway && paymentTimeLeft > 0) {
      timer = setInterval(() => setPaymentTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showPaymentGateway, paymentTimeLeft]);

  const fetchProfile = async () => {
    try {
      const res = await http.get('/users/profile');
      const data = res.data.data;
      setProfileData(data);
      if (!data.address || !data.city || !data.postal_code) {
        setAddressOption('new');
      }
    } catch (err) {}
  };

  const calculateSubtotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = shippingMethod ? shippingRates[shippingMethod].price : 0;
  const totalAkhir = calculateSubtotal() + ongkir;

  const handleOpenPaymentGateway = () => {
    if (!shippingMethod) return setAlertModal({ show: true, type: 'error', title: 'Kurir Kosong', message: 'Pilih jasa pengiriman dulu!', onConfirm: () => setAlertModal(prev => ({ ...prev, show: false })) });
    if (!paymentMethod) return setAlertModal({ show: true, type: 'error', title: 'Pembayaran Kosong', message: 'Pilih metode pembayaran dulu!', onConfirm: () => setAlertModal(prev => ({ ...prev, show: false })) });

    if (addressOption === 'profile' && (!profileData || !profileData.address)) {
      return setAlertModal({ show: true, type: 'error', title: 'Alamat Kosong', message: 'Alamat profil belum lengkap!', onConfirm: () => setAlertModal(prev => ({ ...prev, show: false })) });
    } 
    if (addressOption === 'new') {
      const { nama_penerima, no_hp, provinsi, kecamatan, kota, kode_pos, detail } = newAddress;
      if (!nama_penerima || !no_hp || !provinsi || !kecamatan || !kota || !kode_pos || !detail) {
        return setAlertModal({ show: true, type: 'error', title: 'Alamat Tidak Lengkap', message: 'Harap isi semua kolom alamat baru!', onConfirm: () => setAlertModal(prev => ({ ...prev, show: false })) });
      }
    }
    setShowPaymentGateway(true);
    window.scrollTo(0, 0);
  };

  const executeFinalCheckout = async () => {
    let finalAddress = '';
    if (addressOption === 'profile') {
      finalAddress = `${profileData.name} (${profileData.phone_number}) | ${profileData.address}, Kota ${profileData.city}, ${profileData.postal_code}`;
    } else {
      finalAddress = `${newAddress.nama_penerima} (${newAddress.no_hp}) | ${newAddress.detail}, Kec. ${newAddress.kecamatan}, Kota/Kab. ${newAddress.kota}, Prov. ${newAddress.provinsi}, ${newAddress.kode_pos}`;
    }

    const infoPengirimanLengkap = `[${paymentMethod.toUpperCase()}] - [${shippingRates[shippingMethod].name}] | ${finalAddress}`;

    try {
      setLoading(true);
      await http.post('/orders/checkout', {
        items: cartItems,
        total_price: totalAkhir,
        shipping_address: infoPengirimanLengkap
      });

      if (!isDirectBuy) {
        localStorage.setItem('amba_cart', JSON.stringify([])); 
        window.dispatchEvent(new Event('cartChanged'));
      }

      setAlertModal({
        show: true, type: 'success', title: 'Pembayaran Sukses!',
        message: 'Pesanan telah dibuat dan diteruskan ke penjual.',
        onConfirm: () => navigate('/order-history')
      });
    } catch (error) {
      setAlertModal({
        show: true, type: 'error', title: 'Sistem Sibuk',
        message: 'Gagal memproses pesanan.',
        onConfirm: () => { setAlertModal(prev => ({ ...prev, show: false })); setShowPaymentGateway(false); }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      {showPaymentGateway ? (
        <div className="container mt-4 mb-5 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-dark text-white text-center py-3 rounded-top-4 d-flex align-items-center justify-content-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
              <h6 className="mb-0 fw-bold">AmbaPay Secure Gateway</h6>
            </div>
            <div className="card-body p-4 p-md-5 text-center">
              <p className="text-secondary fw-bold mb-1">Selesaikan pembayaran dalam</p>
              <h2 className="text-danger fw-black mb-4 display-6">{formatTime(paymentTimeLeft)}</h2>
              
              <div className="bg-light p-4 rounded-4 mb-4 border">
                <p className="text-secondary mb-2">Total Tagihan</p>
                <h2 className="fw-black mb-4" style={{ color: brandColor }}>Rp {totalAkhir.toLocaleString('id-ID')}</h2>
                
                {paymentMethod === 'QRIS' ? (
                  <div>
                    <div className="bg-white p-3 d-inline-block rounded-3 border mb-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h-3v2h3v-2zm-3 3h-2v2h2v-2zm3 0h-2v2h2v-2zm0 3h-3v2h3v-2zm-3-3h-2v2h2v-2zm-3 0h-2v2h2v-2zm3 3h-2v2h2v-2zm3-6h-3v2h3v-2zm-6 0h-2v2h2v-2z" />
                      </svg>
                    </div>
                    <p className="fw-bold text-dark small">Scan QRIS dengan aplikasi e-Wallet.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-secondary mb-1">Nomor Virtual Account ({paymentMethod})</p>
                    <h4 className="fw-bold text-dark mb-3 tracking-widest" style={{ letterSpacing: '2px' }}>8950 0812 3456</h4>
                    <p className="text-secondary small">Bayar melalui aplikasi {paymentMethod}.</p>
                  </div>
                )}
              </div>

              <button type="button" onClick={executeFinalCheckout} disabled={loading} className="btn w-100 text-white fw-bold py-3 rounded-pill shadow-lg hover-scale mb-3" style={{ backgroundColor: brandColor }}>
                {loading ? 'Memverifikasi...' : 'Simulasikan Pembayaran Berhasil'}
              </button>
              <button type="button" onClick={() => setShowPaymentGateway(false)} disabled={loading} className="btn btn-light w-100 text-secondary fw-bold py-3 rounded-pill border shadow-sm">
                Batalkan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-2 mt-md-4 mb-5 pb-5">
          <h2 className="fw-black mb-4 fs-4 fs-md-3 d-none d-md-block">Checkout Pesanan</h2>
          <div className="row g-4">
            
            <div className="col-lg-8">
              {/* ALAMAT PENGIRIMAN */}
              <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2 fs-5 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-2 text-danger" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                  Alamat Pengiriman
                </h5>
                <div className="d-flex gap-3 mb-3">
                  <label className="form-check-label border p-2 rounded-3 flex-fill hover-bg-light shadow-sm text-center" style={{ cursor: 'pointer', border: addressOption === 'profile' ? `2px solid ${brandColor}` : '2px solid transparent', backgroundColor: addressOption === 'profile' ? '#f0fdf4' : '#f8f9fa' }}>
                    <input type="radio" className="d-none" checked={addressOption === 'profile'} onChange={() => setAddressOption('profile')} />
                    <span className="fw-bold small" style={{ color: addressOption === 'profile' ? brandColor : '#475569' }}>Alamat Profil</span>
                  </label>
                  <label className="form-check-label border p-2 rounded-3 flex-fill hover-bg-light shadow-sm text-center" style={{ cursor: 'pointer', border: addressOption === 'new' ? `2px solid ${brandColor}` : '2px solid transparent', backgroundColor: addressOption === 'new' ? '#f0fdf4' : '#f8f9fa' }}>
                    <input type="radio" className="d-none" checked={addressOption === 'new'} onChange={() => setAddressOption('new')} />
                    <span className="fw-bold small" style={{ color: addressOption === 'new' ? brandColor : '#475569' }}>Alamat Baru</span>
                  </label>
                </div>

                {addressOption === 'profile' ? (
                  <div className="bg-light p-3 rounded-4 border border-success border-opacity-25">
                    {profileData?.address ? (
                      <><h6 className="fw-bold mb-1">{profileData.name} - {profileData.phone_number}</h6><p className="mb-0 text-secondary small">{profileData.address}, Kota {profileData.city}, {profileData.postal_code}</p></>
                    ) : (
                      <p className="text-danger small mb-0 fw-bold">Alamat profil belum lengkap!</p>
                    )}
                  </div>
                ) : (
                  <div className="row g-3 bg-light p-3 rounded-4 border">
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="Nama Penerima" onChange={e => setNewAddress({...newAddress, nama_penerima: e.target.value})} required/></div>
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="No WhatsApp" onChange={e => setNewAddress({...newAddress, no_hp: e.target.value})} required/></div>
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="Provinsi" onChange={e => setNewAddress({...newAddress, provinsi: e.target.value})} required/></div>
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="Kota" onChange={e => setNewAddress({...newAddress, kota: e.target.value})} required/></div>
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="Kecamatan" onChange={e => setNewAddress({...newAddress, kecamatan: e.target.value})} required/></div>
                    <div className="col-md-6"><input type="text" className="form-control p-2 small" placeholder="Kode Pos" onChange={e => setNewAddress({...newAddress, kode_pos: e.target.value})} required/></div>
                    <div className="col-12"><textarea className="form-control p-2 small" placeholder="Alamat Detail (Jalan, RT/RW...)" rows="2" onChange={e => setNewAddress({...newAddress, detail: e.target.value})} required></textarea></div>
                  </div>
                )}
              </div>

              {/* JASA PENGIRIMAN */}
              <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2 fs-5 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-2 text-primary" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
                  Jasa Pengiriman
                </h5>
                <div className="row g-2">
                  {Object.keys(shippingRates).map(key => (
                    <div className="col-12 col-md-6" key={key}>
                      <label className="border p-3 rounded-4 d-block w-100 hover-scale shadow-sm" style={{ cursor: 'pointer', border: shippingMethod === key ? `2px solid ${brandColor}` : '2px solid transparent', backgroundColor: shippingMethod === key ? '#f0fdf4' : '#f8f9fa' }}>
                        <input type="radio" className="d-none" checked={shippingMethod === key} onChange={() => setShippingMethod(key)} />
                        
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm d-inline-block align-middle">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={brandColor} viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
                        </div>
                        
                        <div className="d-inline-block align-middle">
                          <span className="fw-bold text-dark small d-block mb-1">{shippingRates[key].name}</span>
                          <span className="fw-black fs-6 d-block" style={{ color: brandColor }}>Rp {shippingRates[key].price.toLocaleString('id-ID')}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* PEMBAYARAN: MENGGUNAKAN LOGO ASLI */}
              <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2 fs-5 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="me-2 text-warning" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
                  Metode Pembayaran
                </h5>
                <div className="row g-3">
                  {paymentOptions.map(method => (
                    <div className="col-6 col-md-3" key={method.id}>
                      <label className="border rounded-4 d-flex flex-column align-items-center justify-content-center p-2 w-100 hover-scale shadow-sm position-relative" style={{ cursor: 'pointer', height: '100px', border: paymentMethod === method.id ? `2px solid ${brandColor}` : '2px solid transparent', backgroundColor: paymentMethod === method.id ? '#f0fdf4' : '#f8f9fa' }}>
                        <input type="radio" className="d-none" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} />
                        
                        {/* MENGGUNAKAN IMG UNTUK MENAMPILKAN LOGO */}
                        <div className="d-flex align-items-center justify-content-center mb-1" style={{ height: '40px', width: '100%' }}>
                           <img src={method.image} alt={method.name} style={{ maxHeight: '35px', maxWidth: '80%', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60?text=Logo' }} />
                        </div>
                        
                        <span className="fw-bold small" style={{ color: paymentMethod === method.id ? brandColor : '#475569' }}>{method.name}</span>
                        
                        {paymentMethod === method.id && (
                          <div className="position-absolute bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px', top: '-5px', right: '-5px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RINGKASAN DESKTOP */}
            <div className="col-lg-4 d-none d-lg-block">
              <div className="card shadow-sm p-4 border-0 rounded-4 bg-white sticky-top" style={{ top: '20px' }}>
                <h5 className="fw-bold border-bottom pb-3 mb-3 fs-5 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 text-secondary" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1z"/></svg>
                  Ringkasan Pesanan
                </h5>
                
                <div className="mb-3 bg-light p-3 rounded-4 border" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div className="d-flex justify-content-between mb-2 small" key={item.id}>
                      <span className="text-truncate" style={{maxWidth:'60%'}}>{item.quantity}x {item.name}</span>
                      <span className="fw-bold text-nowrap">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between mb-2 small"><span className="text-secondary">Subtotal Barang</span><span className="fw-bold">Rp {calculateSubtotal().toLocaleString('id-ID')}</span></div>
                <div className="d-flex justify-content-between mb-3 small"><span className="text-secondary">Ongkos Kirim</span><span className="fw-bold">Rp {ongkir.toLocaleString('id-ID')}</span></div>
                
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-end mb-4"><span className="fw-bold text-dark">Total Bayar</span><span className="fw-black fs-4" style={{color: brandColor}}>Rp {totalAkhir.toLocaleString('id-ID')}</span></div>

                <button type="button" onClick={handleOpenPaymentGateway} className="btn w-100 text-white fw-bold py-3 rounded-pill shadow-lg hover-scale" style={{backgroundColor: brandColor}}>Bayar Sekarang</button>
              </div>
            </div>

          </div>

          {/* STICKY BOTTOM BAR KHUSUS HP */}
          <div className="d-lg-none fixed-bottom bg-white border-top p-3 shadow-lg d-flex justify-content-between align-items-center" style={{ zIndex: 1040, borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <div>
              <span className="d-block small text-secondary fw-bold">Total Bayar</span>
              <span className="fw-black fs-5" style={{ color: brandColor }}>Rp {totalAkhir.toLocaleString('id-ID')}</span>
            </div>
            <button type="button" onClick={handleOpenPaymentGateway} className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ backgroundColor: brandColor }}>
              Bayar Sekarang
            </button>
          </div>

        </div>
      )}

      {/* POSISI TERBARU MODAL: Di bawah segalanya agar selalu aktif dirender React! */}
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

export default Checkout;