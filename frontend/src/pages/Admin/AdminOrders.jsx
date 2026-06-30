import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotAdmin from '../../assets/mascotadmin.png'; 

function AdminOrders({ showToast }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); 
  
  const [successPopup, setSuccessPopup] = useState({ show: false, message: '' });
  const [detailModal, setDetailModal] = useState({ show: false, data: null }); 
  const [printModal, setPrintModal] = useState({ show: false, data: null, trackingNumber: '' });
  const [actionModal, setActionModal] = useState({ show: false, type: '', orderId: null });

  const brandColor = '#03AC0E';

  useEffect(() => { fetchOrders(); }, []);

  const sendNotifToUser = async (userId, title, msg) => {
    try {
      await http.post('/notifications', { target_role: 'user', user_id: userId, title, message: msg });
      window.dispatchEvent(new Event('notifUpdate'));
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await http.get('/orders/admin/all'); 
      if (res.data.success) {
        const localRefunds = JSON.parse(localStorage.getItem('amba_refunds')) || {};
        const mergedOrders = res.data.data.map(order => {
          if (localRefunds[order.id]) {
            return { 
              ...order, 
              cancel_reason: order.cancel_reason || localRefunds[order.id].reason, 
              refund_proof: order.refund_proof || localRefunds[order.id].proof 
            };
          }
          return order;
        });
        setOrders(mergedOrders);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const generateOrderID = (id, dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `AMBA${d}${m}${y}${String(id).padStart(4, '0')}X`;
  };

  const handlePrintLabel = (order) => {
    const resi = order.tracking_number || `AMBA-EXP-${order.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPrintModal({ show: true, data: order, trackingNumber: resi });
  };

  const executeShipOrder = async (order) => {
    const resi = order.tracking_number || `AMBA-EXP-${order.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      setLoading(true);
      await http.put(`/orders/admin/${order.id}/status`, { status: 'SHIPPED', tracking_number: resi });
      
      const orderAmbaId = generateOrderID(order.id, order.created_at);
      await sendNotifToUser(order.user_id, 'Pesanan Dikirim!', `Hore! Pesanan #${orderAmbaId} sedang dalam perjalanan.`);
      
      setDetailModal({ show: false, data: null });
      fetchOrders();
      setSuccessPopup({ show: true, message: 'Pesanan diserahkan ke Ekspedisi!' });
    } catch (err) { alert('Gagal memperbarui status.'); } 
    finally { setLoading(false); }
  };

  const executeUpdateStatus = async () => {
    try {
      setLoading(true);
      await http.put(`/orders/admin/${actionModal.orderId}/status`, { status: actionModal.type, tracking_number: '' });
      
      const order = orders.find(o => o.id === actionModal.orderId);
      const orderAmbaId = generateOrderID(actionModal.orderId, order.created_at);
      
      if(actionModal.type === 'CANCELLED') await sendNotifToUser(order.user_id, 'Pesanan Ditolak', `Maaf, pesanan #${orderAmbaId} ditolak oleh penjual.`);
      if(actionModal.type === 'REFUNDED') await sendNotifToUser(order.user_id, 'Refund Disetujui', `Pengajuan refund pesanan #${orderAmbaId} disetujui.`);
      if(actionModal.type === 'REFUND_REJECTED') await sendNotifToUser(order.user_id, 'Refund Ditolak', `Pengajuan refund pesanan #${orderAmbaId} ditolak.`);

      setActionModal({ show: false, type: '', orderId: null });
      setDetailModal({ show: false, data: null });
      fetchOrders();
      setSuccessPopup({ show: true, message: 'Status berhasil diperbarui.' });
    } catch (err) { alert('Gagal memperbarui status.'); } 
    finally { setLoading(false); }
  };

  const parseAddress = (addressString) => {
    if (addressString && addressString.includes('|')) return addressString.split('|')[1].trim();
    return 'Pembeli';
  };

  const formatImageUrl = (img) => img ? (img.startsWith('http') || img.startsWith('/') ? img : `http://127.0.0.1:8000/uploads/${img}`) : 'https://via.placeholder.com/80';

  const tabsWithCount = [
    { id: 'ALL', label: 'Semua', count: orders.length },
    { id: 'PENDING', label: 'Perlu Dikirim', count: orders.filter(o => o.status === 'PENDING').length },
    { id: 'SHIPPED', label: 'Dikirim/Sampai', count: orders.filter(o => ['SHIPPED', 'ARRIVED'].includes(o.status)).length },
    { id: 'DELIVERED', label: 'Selesai', count: orders.filter(o => o.status === 'DELIVERED').length },
    { id: 'CANCELLED', label: 'Batal', count: orders.filter(o => o.status === 'CANCELLED').length },
    { id: 'RETURNED', label: 'Refund', count: orders.filter(o => ['RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(o.status)).length }
  ];

  const filteredOrders = activeTab === 'ALL' ? orders : 
                         activeTab === 'SHIPPED' ? orders.filter(o => ['SHIPPED', 'ARRIVED'].includes(o.status)) : 
                         activeTab === 'RETURNED' ? orders.filter(o => ['RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(o.status)) : 
                         orders.filter(o => o.status === activeTab);

  // ==========================================
  // FIXED: HELPER RENDER MODAL AGAR TIDAK ERROR
  // ==========================================
  const renderDetailModal = () => {
    if (!detailModal.show || !detailModal.data) return null;

    const order = detailModal.data;
    const orderAmbaId = generateOrderID(order.id, order.created_at);
    let progress = 0;
    if(order.status === 'PENDING') progress = 25;
    if(order.status === 'SHIPPED') progress = 50;
    if(order.status === 'ARRIVED') progress = 75;
    if(order.status === 'DELIVERED') progress = 100;

    return (
      <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
        <div className="bg-white border-0 shadow-lg d-flex flex-column" style={{ width: '100%', maxWidth: '700px', borderRadius: '24px', maxHeight: '90vh' }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light" style={{ borderRadius: '24px 24px 0 0' }}>
            <div>
              <h5 className="fw-black text-dark mb-0 d-flex align-items-center">Order #{orderAmbaId}
                <button onClick={() => navigate(`/admin/chat?orderId=${order.id}`, { state: { orderData: order }})} className="btn btn-sm btn-outline-dark rounded-pill ms-3 d-flex align-items-center hover-scale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326z"/></svg> Chat Pembeli
                </button>
              </h5>
            </div>
            <button onClick={() => setDetailModal({ show: false, data: null })} className="btn-close"></button>
          </div>

          <div className="p-4 overflow-auto hide-scrollbar flex-grow-1">
            {!['CANCELLED', 'RETURNED', 'REFUNDED', 'REFUND_REJECTED'].includes(order.status) && (
                <div className="bg-white p-4 mb-3 shadow-sm text-center border rounded-4 mt-3 mx-3">
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

              {order.cancel_reason && (
                <div className={`p-4 border-bottom mb-2 shadow-sm ${['RETURNED', 'REFUND_REJECTED', 'DELIVERED'].includes(order.status) ? 'bg-warning bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                  <h6 className="fw-bold mb-2 text-dark">Info Pengajuan Batal/Refund:</h6>
                  <p className="small text-secondary mb-0 fw-bold">{order.cancel_reason}</p>
                  {order.refund_proof && (
                    <div className="mt-3">
                       <span className="small text-dark fw-bold">Foto Bukti Barang:</span><br/>
                       <img src={order.refund_proof} alt="Bukti" className="img-thumbnail rounded-3 shadow-sm mt-1" style={{maxHeight:'200px'}}/>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-white p-4 mb-2 shadow-sm border-bottom">
                <h6 className="fw-bold mb-2 text-secondary">Alamat Pengiriman</h6>
                <div className="bg-light p-3 rounded-4 border d-flex justify-content-between">
                  <p className="small mb-0 lh-base text-secondary">{order.shipping_address}</p>
                  {order.tracking_number && (
                    <div className="text-end">
                      <span className="small text-muted fw-bold d-block">Resi:</span>
                      <span className="fw-black text-dark tracking-widest">{order.tracking_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 shadow-sm mb-2">
                <h6 className="fw-bold mb-3 text-secondary">Barang yang Dibeli</h6>
                {order.items?.map((item, idx) => (
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom" key={idx}>
                    <div className="bg-white border rounded-3 p-1 me-3 shadow-sm d-flex justify-content-center overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                      <img src={formatImageUrl(item.image_url || item.image)} alt={item.name} className="img-fluid rounded" style={{ objectFit: 'contain' }} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="fw-bold mb-1 text-dark text-truncate">{item.name}</h6>
                      <span className="small text-muted">{item.quantity} Pcs x Rp {Number(item.price).toLocaleString('id-ID')}</span>
                    </div>
                    <span className="fw-black text-dark ms-2">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-top bg-light flex-column flex-sm-row d-flex justify-content-between align-items-center gap-3" style={{ borderRadius: '0 0 24px 24px' }}>
              <div>
                <span className="fw-bold text-secondary d-block small">Total Pendapatan</span>
                <span className="fw-black fs-4" style={{ color: brandColor }}>Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="d-flex gap-2 w-100 w-sm-auto justify-content-end">
                {order.status === 'PENDING' && (
                  <><button onClick={() => setActionModal({ show: true, type: 'CANCELLED', orderId: order.id })} className="btn btn-outline-danger fw-bold rounded-pill px-4 shadow-sm hover-scale">Tolak</button>
                  <button onClick={() => handlePrintLabel(order)} className="btn btn-outline-dark fw-bold rounded-pill px-4 shadow-sm hover-scale">Cetak Label</button>
                  <button onClick={() => executeShipOrder(order)} className="btn text-white fw-bold rounded-pill px-4 shadow-sm hover-scale" style={{ backgroundColor: brandColor }} disabled={loading}>Kirim Ekspedisi</button></>
                )}
                {order.status === 'RETURNED' && (
                  <><button onClick={() => setActionModal({ show: true, type: 'REFUND_REJECTED', orderId: order.id })} className="btn btn-outline-danger fw-bold rounded-pill px-4 shadow-sm hover-scale">Tolak Bukti</button>
                  <button onClick={() => setActionModal({ show: true, type: 'REFUNDED', orderId: order.id })} className="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm hover-scale">Setujui Refund</button></>
                )}
                {['SHIPPED', 'ARRIVED', 'DELIVERED'].includes(order.status) && (
                  <button onClick={() => handlePrintLabel(order)} className="btn btn-outline-dark fw-bold rounded-pill px-4 shadow-sm hover-scale">Cetak Ulang Resi</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

  const renderPrintModal = () => {
    if (!printModal.show || !printModal.data) return null;

    const order = printModal.data;
    const kurir = order.shipping_address.split('|')[0].replace(/\[|\]/g, '').split(' - ')[1] || 'Reguler';
    const namaPembeli = order.shipping_address.split('|')[1]?.split('(')[0] || 'Pembeli';
    const telpPembeli = order.shipping_address.match(/\((.*?)\)/)?.[1] || '-';
    const alamatUtama = order.shipping_address.split('|')[2] || order.shipping_address;
    const orderAmbaId = generateOrderID(order.id, order.created_at);

    return (
      <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="bg-white border-0 shadow-lg d-flex flex-column overflow-hidden" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', fontFamily: 'monospace' }}>
          <div className="d-flex align-items-center w-100 mt-2 px-3 opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/></svg>
             <div className="flex-grow-1 ms-2" style={{ borderBottom: '2px dashed #000' }}></div>
          </div>

          <div className="p-0 bg-white text-dark" style={{ border: '2px solid #000', margin: '15px', position: 'relative' }}>
            <div className="border-bottom border-dark border-2 p-3 d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-black mb-0" style={{ letterSpacing: '1px' }}>AMBACART</h3>
                <span className="fw-bold small">Logistics Express</span>
              </div>
              <div className="text-end">
                <h2 className="fw-black mb-0 border border-dark px-2 py-1">{kurir}</h2>
              </div>
            </div>
            <div className="p-3 text-center border-bottom border-dark border-2 bg-light">
              <div className="mx-auto mb-2" style={{ height: '70px', width: '90%', background: 'repeating-linear-gradient(90deg, #000, #000 4px, transparent 4px, transparent 6px, #000 6px, #000 10px, transparent 10px, transparent 15px, #000 15px, #000 18px, transparent 18px, transparent 22px)' }}></div>
              <h4 className="fw-black fs-4 tracking-widest mb-0">{printModal.trackingNumber}</h4>
            </div>

            <div className="d-flex border-bottom border-dark border-2">
              <div className="p-2 border-end border-dark border-2" style={{ width: '60%' }}>
                <p className="fw-bold mb-1 border-bottom border-dark d-inline-block">Penerima:</p>
                <h6 className="fw-black mb-1">{namaPembeli}</h6>
                <p className="small mb-1">{telpPembeli}</p>
                <p className="small mb-0 lh-sm">{alamatUtama}</p>
              </div>
              <div className="p-2" style={{ width: '40%' }}>
                <p className="fw-bold mb-1 border-bottom border-dark d-inline-block">Pengirim:</p>
                <h6 className="fw-black mb-1">Amba Store</h6>
                <p className="small mb-1">0812-AMBA-CART</p>
                <p className="small mb-0 lh-sm">Depok, Jawa Barat</p>
              </div>
            </div>
            
            <div className="p-2 d-flex justify-content-between align-items-center">
              <div>
                <p className="small fw-bold mb-0">Isi: {order.items?.[0]?.name.substring(0, 15)}... (+{order.items?.length-1} lainnya)</p>
                <p className="small fw-bold mb-0">Pesanan: #{orderAmbaId}</p>
              </div>
              <div className="border border-dark p-1 d-flex flex-wrap" style={{width:'50px', height:'50px'}}>
                 {[...Array(16)].map((_, i) => <div key={i} style={{width:'25%', height:'25%', backgroundColor: Math.random() > 0.5 ? '#000' : '#fff'}}></div>)}
              </div>
            </div>
          </div>

          <div className="p-3 bg-light d-flex gap-2 border-top">
            <button onClick={() => setPrintModal({ show: false, data: null, trackingNumber: '' })} className="btn btn-light fw-bold w-50 border hover-scale text-dark" style={{borderRadius: '0'}}>Batal</button>
            <button onClick={() => { alert("Menghubungkan ke Printer Thermal..."); setPrintModal({ show: false, data: null, trackingNumber: '' }); }} className="btn btn-dark fw-bold w-50 shadow-sm hover-scale" style={{borderRadius: '0'}}>Print</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100 d-flex flex-column position-relative" style={{ background: '#f4f7f6', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2">
        
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '75%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Kelola Pesanan</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Tinjau dan kelola proses pengiriman barang ke pembeli.</p>
          </div>
          <img src={mascotAdmin} alt="Mascot" className="position-absolute d-none d-sm-block" style={{ width: '230px', right: '4%', top: '-55px', zIndex: 5, filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))' }} onError={(e) => e.target.style.display='none'} />
        </div>

        <div className="bg-white rounded-4 shadow-sm border-0 mb-4 px-3 pt-3 overflow-auto hide-scrollbar">
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

        <div className="bg-white rounded-4 shadow-sm border-0 p-3 p-md-4">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{color: brandColor}}></div></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>
              <h6 className="text-muted fw-bold">Tidak ada pesanan.</h6>
            </div>
          ) : (
            <div className="table-responsive hide-scrollbar">
              <table className="table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light text-secondary small text-uppercase fw-bold">
                  <tr>
                    <th className="py-3 px-4 rounded-start-3 border-0">ID & Tanggal</th>
                    <th className="py-3 px-4 border-0">Pembeli</th>
                    <th className="py-3 px-4 rounded-end-3 border-0 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const orderAmbaId = generateOrderID(order.id, order.created_at);
                    return (
                      <tr key={order.id} className="border-bottom" style={{ cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => setDetailModal({ show: true, data: order })} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-4 py-3">
                          <span className="fw-bold text-dark d-block fs-6">#{orderAmbaId}</span>
                          <small className="text-muted fw-medium">{new Date(order.created_at).toLocaleDateString('id-ID')}</small>
                        </td>
                        <td className="px-4 py-3">
                          <span className="fw-bold text-dark d-block fs-6">{parseAddress(order.shipping_address).split('(')[0]}</span>
                          <span className="small text-secondary">{order.items?.length || 0} Jenis Barang</span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <span className={`badge px-4 py-2 rounded-pill shadow-sm ${['SHIPPED', 'ARRIVED'].includes(order.status) ? 'bg-info text-dark' : order.status === 'DELIVERED' ? 'bg-success' : order.status === 'CANCELLED' ? 'bg-danger' : order.status === 'RETURNED' ? 'bg-secondary' : order.status === 'REFUNDED' ? 'bg-dark' : order.status === 'REFUND_REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {order.status === 'ARRIVED' ? 'Telah Sampai' : order.status === 'SHIPPED' ? 'Sedang Dikirim' : order.status === 'PENDING' ? 'Perlu Dikirim' : order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RENDER HELPER FUNCTIONS */}
      {renderDetailModal()}
      {renderPrintModal()}

      {actionModal.show && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-4 border w-100 shadow-lg text-center" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-4">{actionModal.type === 'CANCELLED' ? 'Tolak Pesanan?' : actionModal.type === 'REFUNDED' ? 'Setujui Refund?' : 'Tolak Bukti Refund?'}</h4>
            <div className="d-flex gap-2">
              <button onClick={() => setActionModal({ show: false, type: '', orderId: null })} className="btn btn-light fw-bold w-50 py-3 rounded-pill text-secondary border">Batal</button>
              <button onClick={executeUpdateStatus} className={`btn text-white fw-bold w-50 py-3 rounded-pill shadow-sm ${actionModal.type === 'REFUNDED' ? 'bg-warning text-dark' : 'bg-danger'}`} disabled={loading}>
                Ya, Konfirmasi
              </button>
            </div>
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
            <h4 className="fw-black text-dark mb-2">Sukses!</h4><p className="text-secondary small mb-4">{successPopup.message}</p>
            <button onClick={() => setSuccessPopup({ show: false, message: '' })} className="btn text-white fw-bold w-100 py-3 rounded-pill shadow-sm" style={{ backgroundColor: brandColor }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;