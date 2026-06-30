import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../utils/http';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); 
  const brandColor = '#03AC0E';

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Custom Modals State
  const [successPopup, setSuccessPopup] = useState({ show: false, message: '' });
  const [errorPopup, setErrorPopup] = useState({ show: false, message: '' });
  const [actionModal, setActionModal] = useState({ show: false, type: '', orderId: null });
  const [ratingModal, setRatingModal] = useState({ show: false, orderId: null });

  // Form States
  const [cancelReason, setCancelReason] = useState('');
  const [refundProof, setRefundProof] = useState(null); 
  const [ratingData, setRatingData] = useState({ stars: 0, hover: 0, review: '', photo: null });
  const [userRatings, setUserRatings] = useState([]); 

  useEffect(() => { 
    fetchOrders(); 
    fetchRatings();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await http.get('/orders/my-orders');
      if (res.data.success) {
        const localRefunds = JSON.parse(localStorage.getItem('amba_refunds')) || {};
        const mergedOrders = res.data.data.map(order => {
          if (localRefunds[order.id]) {
            return { ...order, cancel_reason: order.cancel_reason || localRefunds[order.id].reason, refund_proof: order.refund_proof || localRefunds[order.id].proof };
          }
          return order;
        });
        setOrders(mergedOrders);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const fetchRatings = async () => {
    try {
      const res = await http.get('/orders/ratings/all');
      if (res.data.success) {
         const localRatings = JSON.parse(localStorage.getItem('amba_ratings')) || [];
         const mergedRatings = res.data.data.map(r => {
            const local = localRatings.find(lr => lr.order_id === r.order_id);
            if (local && local.photo) r.photo = local.photo;
            return r;
         });
         setUserRatings(mergedRatings);
      }
    } catch (error) {}
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorPopup({ show: true, message: 'Ukuran foto terlalu besar! Maksimal 5MB.' });
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if(type === 'refund') setRefundProof(reader.result);
        if(type === 'rating') setRatingData({...ratingData, photo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const sendNotifToAdmin = async (title, msg) => {
    try {
      await http.post('/notifications', { target_role: 'admin', title, message: msg });
      window.dispatchEvent(new Event('notifUpdate'));
    } catch (err) { console.error(err); }
  };

  const executeUpdateStatus = async () => {
    if (actionModal.type === 'CANCELLED' && !cancelReason) return setErrorPopup({ show: true, message: "Silakan pilih alasan pembatalan terlebih dahulu!" });
    if (actionModal.type === 'RETURNED' && (!cancelReason || !refundProof)) return setErrorPopup({ show: true, message: "Alasan dan Foto Bukti Kerusakan WAJIB dilampirkan untuk pengajuan Refund!" });
    
    let messageStr = actionModal.type === 'CANCELLED' ? 'Pesanan berhasil dibatalkan.' 
                   : actionModal.type === 'RETURNED' ? 'Pengajuan refund berhasil dikirim ke Penjual.' 
                   : actionModal.type === 'ARRIVED' ? 'Status diperbarui! Silakan periksa barang Anda.'
                   : 'Terima kasih! Pesanan telah diselesaikan.';
                   
    try {
      setLoading(true);

      if (actionModal.type === 'CANCELLED' || actionModal.type === 'RETURNED') {
        const localRefunds = JSON.parse(localStorage.getItem('amba_refunds')) || {};
        localRefunds[actionModal.orderId] = { reason: cancelReason, proof: refundProof };
        localStorage.setItem('amba_refunds', JSON.stringify(localRefunds));
      }

      try {
        await http.put(`/orders/${actionModal.orderId}/status`, { 
          status: actionModal.type, cancel_reason: cancelReason, refund_proof: refundProof
        });
      } catch (backendErr) {
        await http.put(`/orders/${actionModal.orderId}/status`, { 
          status: actionModal.type, cancel_reason: cancelReason 
        });
      }
      
      const orderAmbaId = `AMBA${actionModal.orderId}X`;
      if(actionModal.type === 'CANCELLED') await sendNotifToAdmin('Pesanan Dibatalkan', `Order #${orderAmbaId} dibatalkan oleh pembeli.`);
      if(actionModal.type === 'RETURNED') await sendNotifToAdmin('Pengajuan Refund', `Order #${orderAmbaId} mengajukan refund dengan bukti.`);
      if(actionModal.type === 'ARRIVED') await sendNotifToAdmin('Pesanan Sampai', `Order #${orderAmbaId} telah sampai di alamat tujuan.`);

      setActionModal({ show: false, type: '', orderId: null });
      setCancelReason(''); setRefundProof(null);
      setShowDetailModal(false);
      fetchOrders();
      setSuccessPopup({ show: true, message: messageStr });
    } catch (error) { setErrorPopup({ show: true, message: "Gagal memperbarui pesanan. Silakan coba beberapa saat lagi." }); } 
    finally { setLoading(false); }
  };

  const submitRating = async () => {
    if (ratingData.stars === 0) return setErrorPopup({ show: true, message: 'Silakan berikan penilaian bintang (1-5) terlebih dahulu!' });
    
    const orderDetails = orders.find(o => o.id === ratingModal.orderId);
    const itemName = orderDetails.items[0]?.name || 'Produk';
    
    const existingRatings = JSON.parse(localStorage.getItem('amba_ratings')) || [];
    existingRatings.unshift({
      id: Date.now(), order_id: ratingModal.orderId, item_name: itemName,
      stars: ratingData.stars, review: ratingData.review, photo: ratingData.photo,
      date: new Date().toLocaleDateString('id-ID')
    });
    localStorage.setItem('amba_ratings', JSON.stringify(existingRatings));

    try {
      setLoading(true);

      try {
        await http.post('/orders/rating', {
          order_id: ratingModal.orderId, item_name: itemName, stars: ratingData.stars, review: ratingData.review, photo: ratingData.photo
        });
      } catch (err) {
        await http.post('/orders/rating', {
          order_id: ratingModal.orderId, item_name: itemName, stars: ratingData.stars, review: ratingData.review
        });
      }

      await http.put(`/orders/${ratingModal.orderId}/status`, { status: 'DELIVERED' });
      await sendNotifToAdmin('Ulasan Baru & Selesai', `Order #AMBA${ratingModal.orderId}X telah selesai dan diberi ${ratingData.stars} Bintang!`);
      
      setRatingModal({ show: false, orderId: null });
      setRatingData({ stars: 0, hover: 0, review: '', photo: null });
      setShowDetailModal(false);
      fetchOrders();
      fetchRatings(); 
      setSuccessPopup({ show: true, message: 'Terima kasih atas penilaian Anda! Pesanan Selesai.' });
    } catch (error) { setErrorPopup({ show: true, message: "Gagal menyimpan ulasan ke server." }); }
    finally { setLoading(false); }
  };

  const parseOrderInfo = (addressString) => {
    let payment = 'Transfer/E-Wallet', courier = 'Reguler', namePhone = 'Pembeli', addressDetail = addressString;
    try {
      if (addressString && addressString.includes('|')) {
        const parts = addressString.split('|').map(p => p.trim());
        if (parts.length >= 3) {
          namePhone = parts[1]; addressDetail = parts.slice(2).join(', ');
        }
      }
    } catch (e) {}
    return { payment, courier, namePhone, addressDetail };
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Belum Dikirim</span>;
      case 'SHIPPED': return <span className="badge bg-info text-dark px-3 py-2 rounded-pill shadow-sm">Sedang Dikirim</span>;
      case 'ARRIVED': return <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">Telah Sampai</span>;
      case 'DELIVERED': return <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">Selesai</span>;
      case 'CANCELLED': return <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">Dibatalkan</span>;
      case 'RETURNED': return <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">Pengajuan Refund</span>;
      case 'REFUND_REJECTED': return <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">Refund Ditolak</span>;
      case 'REFUNDED': return <span className="badge bg-dark px-3 py-2 rounded-pill shadow-sm">Dana Dikembalikan</span>;
      default: return <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  const getStatusText = (status) => {
    if (status === 'SHIPPED') return 'Pesanan Sedang Dikirim';
    if (status === 'DELIVERED') return 'Pesanan Selesai';
    if (status === 'CANCELLED') return 'Pesanan Dibatalkan';
    if (status === 'RETURNED') return 'Pengajuan Refund';
    if (status === 'REFUNDED') return 'Dana Dikembalikan';
    if (status === 'REFUND_REJECTED') return 'Pengajuan Refund Ditolak';
    return 'Menunggu Dikemas';
  };

  const formatImageUrl = (img) => img ? (img.startsWith('http') || img.startsWith('/') ? img : `http://127.0.0.1:8000/uploads/${img}`) : 'https://via.placeholder.com/80';

  const generateOrderID = (id) => `AMBA${String(id).padStart(4, '0')}X`;

  const tabsWithCount = [
    { id: 'ALL', label: 'Semua', count: orders.length },
    { id: 'PENDING', label: 'Belum Dikirim', count: orders.filter(o => o.status === 'PENDING').length },
    { id: 'SHIPPED', label: 'Dikirim/Sampai', count: orders.filter(o => ['SHIPPED', 'ARRIVED'].includes(o.status)).length },
    { id: 'DELIVERED', label: 'Selesai', count: orders.filter(o => o.status === 'DELIVERED').length },
    { id: 'CANCELLED', label: 'Dibatalkan', count: orders.filter(o => o.status === 'CANCELLED').length },
    { id: 'RETURNED', label: 'Pengembalian', count: orders.filter(o => ['RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(o.status)).length }
  ];

  const filteredOrders = activeTab === 'ALL' ? orders : 
                         activeTab === 'SHIPPED' ? orders.filter(o => ['SHIPPED', 'ARRIVED'].includes(o.status)) : 
                         activeTab === 'RETURNED' ? orders.filter(o => ['RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(o.status)) : 
                         orders.filter(o => o.status === activeTab);

  return (
    <div className="container mt-4 mb-5 min-vh-100" style={{ maxWidth: '900px' }}>
      <h3 className="fw-black mb-4 fs-4 d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill={brandColor} className="me-2" viewBox="0 0 16 16"><path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>
        Pesanan Saya
      </h3>

      <div className="bg-white rounded-4 shadow-sm border mb-4 px-3 pt-3 overflow-auto hide-scrollbar">
        <ul className="nav nav-tabs border-0 flex-nowrap" style={{ whiteSpace: 'nowrap' }}>
          {tabsWithCount.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button onClick={() => setActiveTab(tab.id)} className={`nav-link fw-bold border-0 bg-transparent px-4 pb-3 d-flex align-items-center ${activeTab === tab.id ? 'text-dark' : 'text-secondary'}`} style={{ borderBottom: activeTab === tab.id ? `3px solid ${brandColor}` : '3px solid transparent', borderRadius: 0, transition: 'all 0.2s' }}>
                {tab.label} {tab.count > 0 && <span className={`badge rounded-pill ms-2 ${activeTab === tab.id ? 'bg-danger' : 'bg-secondary'}`}>{tab.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{color: brandColor}}></div></div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#e2e8f0" className="mb-3" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>
          <h5 className="text-dark fw-bold mb-1">Belum ada pesanan</h5>
          <p className="text-secondary small">Yuk, cari barang impianmu dan checkout sekarang!</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredOrders.map(order => {
            const firstItem = order.items?.[0];
            const isFinished = ['DELIVERED', 'CANCELLED', 'REFUNDED', 'RETURNED', 'REFUND_REJECTED'].includes(order.status);

            return (
              <div className="col-12" key={order.id}>
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-2">
                  <div className="card-header bg-white border-bottom py-3 px-3 px-md-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={brandColor} className="me-2" viewBox="0 0 16 16"><path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .364-.976l2.605-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1-1h-2a1 1 0 0 1-1-1v-3z"/></svg>
                      <span className="fw-bold text-dark me-2">AmbaCart Official</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="card-body px-3 px-md-4 py-3 bg-light cursor-pointer hover-scale" onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}>
                    <div className="d-flex align-items-center">
                      <div className="bg-white border rounded-3 p-2 me-3 shadow-sm d-flex justify-content-center overflow-hidden" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        <img src={formatImageUrl(firstItem?.image_url || firstItem?.image)} alt="Produk" className="img-fluid rounded" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h6 className="fw-bold mb-1 text-dark text-truncate">{firstItem?.name || `Order #${order.id}`}</h6>
                        <p className="text-secondary small mb-1">x{firstItem?.quantity || 1} Barang</p>
                      </div>
                      <div className="text-end ms-2">
                        <span className="small text-secondary d-block mb-1">Total Pesanan</span>
                        <h6 className="fw-black mb-0" style={{color: brandColor}}>Rp {Number(order.total_price).toLocaleString('id-ID')}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-top px-3 px-md-4 py-3 d-flex justify-content-between align-items-center gap-2">
                    <span className="text-secondary small d-none d-sm-block"><i className="bi bi-shield-check text-success"></i> Dilindungi oleh Garansi AmbaCart</span>
                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-sm btn-outline-secondary fw-bold px-3 hover-scale" onClick={() => navigate(`/chat?orderId=${order.id}`)}>Hubungi Penjual</button>
                      <button type="button" onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }} className={`btn btn-sm fw-bold px-4 hover-scale shadow-sm ${!isFinished ? 'text-white' : 'btn-light border text-dark'}`} style={{ backgroundColor: !isFinished ? brandColor : undefined }}>
                        Rincian Pesanan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDetailModal && selectedOrder && (() => {
        const info = parseOrderInfo(selectedOrder.shipping_address);
        const st = selectedOrder.status;
        const isCancelled = ['CANCELLED'].includes(st);
        const isRefundReq = st === 'RETURNED';
        const isRefunded = st === 'REFUNDED';
        const isRefundRejected = st === 'REFUND_REJECTED';
        
        let progress = 0;
        if(st === 'PENDING') progress = 25;
        if(st === 'SHIPPED') progress = 50;
        if(st === 'ARRIVED') progress = 75;
        if(st === 'DELIVERED') progress = 100;

        const myRating = userRatings.find(r => r.order_id === selectedOrder.id);

        return (
          <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered w-100" style={{ maxWidth: '700px' }}>
              <div className="modal-content border-0 rounded-4 shadow-lg bg-light w-100" style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header border-bottom bg-white py-3 px-4 flex-shrink-0 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-black m-0 text-dark">Rincian Order {generateOrderID(selectedOrder.id)}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                </div>
                
                <div className="modal-body p-0 overflow-auto hide-scrollbar">
                  <div className={`text-white p-4 ${isCancelled || isRefundRejected ? 'bg-danger' : isRefunded || isRefundReq ? 'bg-secondary' : ''}`} style={{ backgroundColor: (!isCancelled && !isRefundReq && !isRefunded && !isRefundRejected) ? brandColor : undefined }}>
                    <h5 className="fw-bold mb-1 d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>Status: {getStatusText(selectedOrder.status)}</h5>
                    <p className="small mb-0 opacity-75 ms-4">{selectedOrder.status === 'PENDING' ? 'Penjual sedang mempersiapkan pesananmu.' : st === 'SHIPPED' ? 'Pesananmu sedang dikirim dengan kurir.' : isCancelled ? 'Pesanan telah dibatalkan.' : st === 'REFUND_REJECTED' ? 'Pengajuan refund ditolak penjual (Barang tetap menjadi milik Anda).' : isRefunded ? 'Dana telah dikembalikan.' : 'Pesanan telah selesai.'}</p>
                  </div>

                  {!['CANCELLED', 'RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(st) && (
                    <div className="bg-white p-4 mb-2 shadow-sm text-center">
                       <h6 className="fw-bold mb-4 text-dark">Status Perjalanan Pesanan</h6>
                       <div className="position-relative d-flex justify-content-between align-items-center px-2 px-md-5 mb-2">
                          <div className="position-absolute bg-light" style={{height:'4px', left:'10%', right:'10%', top:'12px', zIndex: 0}}></div>
                          <div className="position-absolute bg-success" style={{height:'4px', left:'10%', width: `${progress-10}%`, top:'12px', zIndex: 1, transition:'width 0.5s ease'}}></div>
                          
                          <div className="position-relative z-2 d-flex flex-column align-items-center">
                             <div className={`rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm mb-2 ${progress >= 25 ? 'bg-success' : 'bg-secondary'}`} style={{width:'28px', height:'28px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 9.5A.5.5 0 0 1 6 9h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/></svg></div>
                             <span className="small fw-bold" style={{fontSize:'0.7rem'}}>Dibuat</span>
                          </div>
                          <div className="position-relative z-2 d-flex flex-column align-items-center">
                             <div className={`rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm mb-2 ${progress >= 50 ? 'bg-success' : 'bg-light text-secondary border'}`} style={{width:'28px', height:'28px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.587l-1.314 7h-8.03z"/></svg></div>
                             <span className="small fw-bold" style={{fontSize:'0.7rem'}}>Dikirim</span>
                          </div>
                          <div className="position-relative z-2 d-flex flex-column align-items-center">
                             <div className={`rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm mb-2 ${progress >= 75 ? 'bg-success' : 'bg-light text-secondary border'}`} style={{width:'28px', height:'28px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg></div>
                             <span className="small fw-bold" style={{fontSize:'0.7rem'}}>Sampai</span>
                          </div>
                          <div className="position-relative z-2 d-flex flex-column align-items-center">
                             <div className={`rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm mb-2 ${progress === 100 ? 'bg-success' : 'bg-light text-secondary border'}`} style={{width:'28px', height:'28px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg></div>
                             <span className="small fw-bold" style={{fontSize:'0.7rem'}}>Selesai</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* FIXED: RIWAYAT REFUND/BATAL TETAP ADA WALAUPUN STATUS DELIVERED */}
                  {selectedOrder.cancel_reason && (
                    <div className={`bg-white p-4 mb-2 shadow-sm border-start border-4 ${['RETURNED', 'REFUND_REJECTED', 'DELIVERED'].includes(st) ? 'border-warning' : 'border-danger'}`}>
                      <h6 className="fw-bold mb-1 text-dark">Info Pengajuan Batal/Refund:</h6>
                      <p className="small text-secondary mb-0 fw-bold">{selectedOrder.cancel_reason}</p>
                      {selectedOrder.refund_proof && (
                        <div className="mt-3">
                           <span className="small text-dark fw-bold">Foto Bukti Barang:</span><br/>
                           <img src={selectedOrder.refund_proof} alt="Bukti" className="img-thumbnail rounded-3 shadow-sm mt-1" style={{maxHeight:'150px'}}/>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-white p-4 mb-2 shadow-sm">
                    <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center text-danger">Alamat & Resi Pengiriman</h6>
                    <p className="fw-bold text-dark mb-1">{info.namePhone}</p>
                    <p className="text-secondary small mb-3">{info.addressDetail}</p>
                    {selectedOrder.tracking_number && (
                      <div className="bg-light p-2 rounded-3 border d-inline-block">
                        <span className="small text-muted fw-bold me-2">No. Resi:</span><span className="fw-black text-dark">{selectedOrder.tracking_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 shadow-sm mb-2">
                    <h6 className="fw-bold mb-3 border-bottom pb-2 text-primary">Rincian Barang ({selectedOrder.items?.length || 0})</h6>
                    {selectedOrder.items?.map((item, idx) => (
                      <div className="d-flex align-items-center mb-3" key={idx}>
                        <div className="bg-light border rounded-3 p-2 me-3 shadow-sm d-flex justify-content-center align-items-center overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                          <img src={formatImageUrl(item.image_url || item.image)} className="img-fluid rounded" alt={item.name} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="mb-0 fw-bold text-dark lh-sm text-truncate">{item.name}</p>
                          <small className="text-secondary fw-medium">Jumlah: {item.quantity}</small>
                        </div>
                        <div className="text-end ms-2"><span className="fw-black small text-dark text-nowrap">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span></div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                      <span className="fw-bold text-secondary">Total Pesanan</span><span className="fw-black fs-4" style={{color: brandColor}}>Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {myRating && (
                    <div className="bg-success bg-opacity-10 p-4 mb-2 shadow-sm border-start border-4 border-success">
                       <h6 className="fw-bold mb-2 text-success d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                          Penilaian Anda
                       </h6>
                       <div className="mb-2">
                          {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={i < myRating.stars ? "#ffc107" : "#cbd5e1"} className="me-1" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>)}
                       </div>
                       <p className="small text-dark mb-0 fw-medium fst-italic">"{myRating.review || 'Tidak ada komentar.'}"</p>
                       {myRating.photo && <img src={myRating.photo} alt="Ulasan" className="img-thumbnail rounded-3 mt-2 shadow-sm" style={{maxHeight:'100px'}} />}
                    </div>
                  )}
                </div>

                <div className="bg-white border-top px-4 py-3 flex-shrink-0 d-flex flex-column gap-2">
                  <div className="d-flex gap-2 w-100 justify-content-end">
                    <button type="button" className="btn btn-light border fw-bold px-4 text-secondary hover-scale" onClick={() => setShowDetailModal(false)}>Tutup</button>
                    
                    {st === 'PENDING' && (
                      <button onClick={() => setActionModal({ show: true, type: 'CANCELLED', orderId: selectedOrder.id })} className="btn btn-outline-danger fw-bold px-4 shadow-sm hover-scale">Batalkan Pesanan</button>
                    )}

                    {st === 'SHIPPED' && (
                      <button onClick={() => setActionModal({ show: true, type: 'ARRIVED', orderId: selectedOrder.id })} className="btn btn-primary fw-bold px-4 shadow-sm hover-scale text-white">
                        Lacak & Konfirmasi Sampai
                      </button>
                    )}

                    {st === 'ARRIVED' && (
                      <>
                        <button onClick={() => setActionModal({ show: true, type: 'RETURNED', orderId: selectedOrder.id })} className="btn btn-outline-warning fw-bold px-4 text-dark shadow-sm hover-scale">Ajukan Refund</button>
                        <button onClick={() => { setShowDetailModal(false); setRatingModal({ show: true, orderId: selectedOrder.id }); }} className="btn text-white fw-bold px-4 shadow-sm hover-scale" style={{ backgroundColor: brandColor }}>Selesaikan Pesanan</button>
                      </>
                    )}

                    {/* FIXED: TOMBOL SELESAIKAN & BERI ULASAN MUNCUL JIKA REFUND DITOLAK! */}
                    {st === 'REFUND_REJECTED' && !myRating && (
                      <button onClick={() => { setShowDetailModal(false); setRatingModal({ show: true, orderId: selectedOrder.id }); }} className="btn text-white fw-bold px-4 shadow-sm hover-scale" style={{ backgroundColor: brandColor }}>Selesaikan & Beri Ulasan</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {actionModal.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border w-100 shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-2">
              {actionModal.type === 'CANCELLED' ? 'Batalkan Pesanan?' : actionModal.type === 'RETURNED' ? 'Ajukan Refund?' : 'Barang Telah Sampai?'}
            </h4>
            <p className="text-secondary small mb-4">
              {actionModal.type === 'CANCELLED' ? 'Pesanan yang dibatalkan tidak dapat dikembalikan lagi.' : actionModal.type === 'RETURNED' ? 'Ajukan pengembalian dengan bukti foto.' : 'Apakah Anda sudah menerima paket dari kurir dengan baik?'}
            </p>

            {actionModal.type === 'CANCELLED' && (
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-dark">Pilih Alasan Pembatalan:</label>
                <select className="form-select bg-light border-0 p-3 shadow-sm" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                  <option value="" disabled>Pilih Alasan...</option>
                  <option value="Ingin mengubah alamat pengiriman">Ingin mengubah alamat pengiriman</option>
                  <option value="Ingin mengubah rincian pesanan">Ingin mengubah rincian pesanan (Warna/Ukuran)</option>
                  <option value="Menemukan harga yang lebih murah di toko lain">Menemukan harga yang lebih murah di toko lain</option>
                  <option value="Penjual tidak merespon chat">Penjual tidak merespon chat</option>
                  <option value="Lainnya">Lainnya / Berubah Pikiran</option>
                </select>
              </div>
            )}

            {actionModal.type === 'RETURNED' && (
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-dark">Alasan Refund:</label>
                <textarea className="form-control bg-light border-0 p-3 mb-2 shadow-sm" rows="2" placeholder="Barang rusak / Tidak sesuai..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}></textarea>
                <label className="form-label small fw-bold text-dark mt-2">Foto Bukti (Wajib):</label>
                <input type="file" className="form-control bg-light border-0 p-2 shadow-sm" accept="image/*" onChange={(e) => handleFileChange(e, 'refund')} />
                {refundProof && <img src={refundProof} alt="Bukti" className="mt-2 rounded-3 img-thumbnail shadow-sm" style={{maxHeight:'80px'}} />}
              </div>
            )}

            <div className="d-flex gap-2">
              <button onClick={() => { setActionModal({ show: false, type: '', orderId: null }); setCancelReason(''); setRefundProof(null); }} className="btn btn-light fw-bold w-50 py-3 rounded-pill text-secondary border hover-scale">Kembali</button>
              <button onClick={executeUpdateStatus} className={`btn text-white fw-bold w-50 py-3 rounded-pill shadow-sm hover-scale ${actionModal.type === 'CANCELLED' ? 'bg-danger' : actionModal.type === 'RETURNED' ? 'bg-warning text-dark' : 'bg-primary'}`} disabled={loading}>
                {loading ? 'Loading...' : actionModal.type === 'CANCELLED' ? 'Konfirmasi Batal' : actionModal.type === 'RETURNED' ? 'Ajukan Refund' : 'Ya, Barang Sampai'}
              </button>
            </div>
          </div>
        </div>
      )}

      {ratingModal.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 p-md-5 border w-100 shadow-lg text-center" style={{ maxWidth: '450px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-2">Beri Penilaian</h4>
            <p className="text-secondary small mb-4">Bagaimana kepuasan Anda terhadap pesanan ini?</p>
            
            <div className="d-flex justify-content-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} onClick={() => setRatingData({...ratingData, stars: star})} onMouseEnter={() => setRatingData({...ratingData, hover: star})} onMouseLeave={() => setRatingData({...ratingData, hover: 0})} xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill={star <= (ratingData.hover || ratingData.stars) ? "#ffc107" : "#e2e8f0"} className="hover-scale" style={{cursor:'pointer', transition: 'fill 0.2s'}} viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>

            <textarea className="form-control bg-light border-0 p-3 mb-3 shadow-sm text-start" rows="3" placeholder="Tulis pengalaman belanja Anda (Kualitas barang, kecepatan kurir...)" value={ratingData.review} onChange={(e) => setRatingData({...ratingData, review: e.target.value})}></textarea>
            
            <div className="text-start mb-4">
               <label className="form-label small fw-bold text-dark mb-1">Upload Foto / Video Produk (Opsional)</label>
               <input type="file" className="form-control bg-light border-0 p-2 shadow-sm" accept="image/*" onChange={(e) => handleFileChange(e, 'rating')} />
               {ratingData.photo && <img src={ratingData.photo} alt="Rating" className="mt-2 rounded-3 img-thumbnail shadow-sm" style={{maxHeight:'80px'}} />}
            </div>

            <div className="d-flex gap-2">
              <button onClick={() => setRatingModal({ show: false, orderId: null })} className="btn btn-light fw-bold w-50 py-3 rounded-pill text-secondary border hover-scale">Lewati</button>
              <button onClick={submitRating} className="btn text-white fw-bold w-50 py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Kirim Ulasan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL ERROR CUSTOM */}
      {errorPopup.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-4 border w-100 shadow-lg text-center" style={{ maxWidth: '350px', borderRadius: '24px' }}>
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Oops!</h4>
            <p className="text-secondary small mb-4">{errorPopup.message}</p>
            <button onClick={() => setErrorPopup({ show: false, message: '' })} className="btn btn-danger fw-bold w-100 py-3 rounded-pill shadow-sm hover-scale">Mengerti</button>
          </div>
        </div>
      )}

      {successPopup.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border-0 w-100 text-center shadow-lg" style={{ maxWidth: '350px', borderRadius: '24px' }}>
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Berhasil!</h4>
            <p className="text-secondary small mb-4">{successPopup.message}</p>
            <button onClick={() => setSuccessPopup({ show: false, message: '' })} className="btn text-white fw-bold w-100 py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;