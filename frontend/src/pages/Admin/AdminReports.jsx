import React, { useState, useEffect } from 'react';
import http from '../../utils/http';
import AdminNavbar from '../../components/Navbar/AdminSidebar';
import mascotAdmin from '../../assets/mascotadmin.png'; 

function AdminReports({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successPopup, setSuccessPopup] = useState({ show: false, message: '' }); 
  const [chartPeriod, setChartPeriod] = useState(7); 
  const brandColor = '#03AC0E';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOrders = await http.get('/orders/admin/all'); 
        if (resOrders.data.success) setOrders(resOrders.data.data);
        
        const resRatings = await http.get('/orders/ratings/all');
        if (resRatings.data.success) {
          // FIXED: Tarik gambar rating dari LocalStorage jika MySQL memotong gambar besar
          const localRatings = JSON.parse(localStorage.getItem('amba_ratings')) || [];
          const mergedRatings = resRatings.data.data.map(r => {
             const local = localRatings.find(lr => lr.order_id === r.order_id);
             if (local && local.photo) r.photo = local.photo;
             return r;
          });
          setRatings(mergedRatings);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const now = new Date();

  const getRevenueByDays = (days) => {
     const limitDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
     return orders
       .filter(o => ['DELIVERED', 'REFUND_REJECTED'].includes(o.status) && new Date(o.created_at) >= limitDate)
       .reduce((acc, curr) => acc + Number(curr.total_price), 0);
  };

  const rev7Days = getRevenueByDays(7);
  const rev30Days = getRevenueByDays(30);
  const rev1Year = getRevenueByDays(365);
  const totalRevenue = getRevenueByDays(9999);

  const averageRating = ratings.length > 0 
      ? (ratings.reduce((acc, curr) => acc + curr.stars, 0) / ratings.length).toFixed(1)
      : '0.0';

  const handleExportCSV = () => {
    const headers = "ID Pesanan,Tanggal,Status,Total Pembayaran,Alamat Pengiriman\n";
    const csvData = orders.map(o => `AMBA${o.id}X,${new Date(o.created_at).toLocaleDateString('id-ID')},${o.status},${o.total_price},"${o.shipping_address}"`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Penjualan_AmbaCart_${new Date().toLocaleDateString('id-ID')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setSuccessPopup({ show: true, message: 'Laporan CSV berhasil diunduh ke perangkat Anda!' });
  };

  const generateChartData = () => {
    const data = [];
    const validOrders = orders.filter(o => ['DELIVERED', 'REFUND_REJECTED'].includes(o.status));

    if (chartPeriod === 7) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const label = d.toLocaleDateString('id-ID', { weekday: 'short' });
        const total = validOrders.filter(o => new Date(o.created_at).toDateString() === d.toDateString()).reduce((sum, o) => sum + Number(o.total_price), 0);
        data.push({ label, total });
      }
    } else if (chartPeriod === 30) {
      for (let i = 3; i >= 0; i--) {
        const label = `Minggu ${4-i}`;
        const total = validOrders.filter(o => {
          const diffDays = Math.floor((now.getTime() - new Date(o.created_at).getTime()) / (1000 * 3600 * 24));
          return diffDays >= i*7 && diffDays < (i+1)*7;
        }).reduce((sum, o) => sum + Number(o.total_price), 0);
        data.push({ label, total });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleDateString('id-ID', { month: 'short' });
        const total = validOrders.filter(o => {
          const od = new Date(o.created_at);
          return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
        }).reduce((sum, o) => sum + Number(o.total_price), 0);
        data.push({ label, total });
      }
    }
    const maxVal = Math.max(...data.map(d => d.total), 1);
    return data.map(d => ({ ...d, height: `${(d.total / maxVal) * 100}%` }));
  };

  const chartData = generateChartData();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f4f7f6', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2">
        
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '65%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Laporan Penjualan</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Ringkasan performa toko, analitik transaksi selesai, dan ulasan pelanggan.</p>
          </div>
          <button onClick={handleExportCSV} className="btn bg-white text-dark fw-bold px-4 py-2.5 rounded-pill shadow-sm hover-scale d-none d-md-flex align-items-center position-relative me-4" style={{ zIndex: 5 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z"/><path fillRule="evenodd" d="M1 14.5A1.5 1.5 0 0 1 2.5 13h11a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-.5z"/></svg>
            Unduh CSV
          </button>
          <img src={mascotAdmin} alt="Mascot" className="position-absolute d-none d-lg-block" style={{ width: '180px', right: '15%', top: '-30px', zIndex: 5, filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))' }} onError={(e) => e.target.style.display='none'} />
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{color: brandColor}}></div></div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3">
                <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-success h-100 d-flex justify-content-between align-items-center hover-scale">
                  <div>
                    <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Pendapatan 7 Hari</span>
                    <h4 className="fw-black mb-0 text-dark">Rp {rev7Days.toLocaleString('id-ID')}</h4>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success d-none d-xl-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.491v1.233c-2.302.215-3.71 1.51-3.71 3.328 0 1.58.98 2.5 3.058 3.011l.732.189v4.296c-1.16-.145-1.956-.8-2.15-1.78l-1.428-.497zM11.23 7.375c0 .918-.727 1.488-2.028 1.838l-.73.192V4.46c1.077.202 1.758.825 1.758 1.63V7.375zM5.53 11.83c0-1.02.83-1.59 2.183-1.93l.732-.188v5.18c-1.242-.2-2.065-.898-2.065-1.96V11.83z"/></svg>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-info h-100 d-flex justify-content-between align-items-center hover-scale">
                  <div>
                    <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Pendapatan 30 Hari</span>
                    <h4 className="fw-black mb-0 text-dark">Rp {rev30Days.toLocaleString('id-ID')}</h4>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info d-none d-xl-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border border-start border-4 border-primary h-100 d-flex justify-content-between align-items-center hover-scale">
                  <div>
                    <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Pendapatan 1 Tahun</span>
                    <h4 className="fw-black mb-0 text-dark">Rp {rev1Year.toLocaleString('id-ID')}</h4>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary d-none d-xl-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="p-3 p-md-4 rounded-4 shadow-sm border-0 h-100 position-relative overflow-hidden d-flex justify-content-between align-items-center hover-scale" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
                  <div className="z-1">
                    <span className="small fw-bold text-uppercase d-block mb-1 opacity-75">Saldo Keseluruhan</span>
                    <h4 className="fw-black mb-0">Rp {totalRevenue.toLocaleString('id-ID')}</h4>
                  </div>
                  <div className="z-1 bg-white bg-opacity-25 p-3 rounded-circle d-none d-xl-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4 shadow-sm border-0 p-4 mb-4 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-4">
                 <h5 className="fw-bold mb-0 text-dark d-flex align-items-center">
                   <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success me-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/></svg>
                   </div>
                   Grafik Penjualan
                 </h5>
                 <select className="form-select shadow-sm fw-bold text-secondary bg-light border-0" style={{width:'auto', borderRadius:'12px'}} value={chartPeriod} onChange={(e) => setChartPeriod(Number(e.target.value))}>
                    <option value={7}>7 Hari Terakhir</option>
                    <option value={30}>30 Hari Terakhir</option>
                    <option value={365}>1 Tahun Terakhir</option>
                 </select>
              </div>

              <div className="position-relative d-flex align-items-end justify-content-around pt-4" style={{ height: '300px' }}>
                <div className="position-absolute w-100" style={{ bottom: '0%', borderBottom: '2px solid #e2e8f0', zIndex: 0 }}></div>
                <div className="position-absolute w-100" style={{ bottom: '25%', borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}></div>
                <div className="position-absolute w-100" style={{ bottom: '50%', borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}></div>
                <div className="position-absolute w-100" style={{ bottom: '75%', borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}></div>
                <div className="position-absolute w-100" style={{ bottom: '100%', borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}></div>

                {chartData.map((data, index) => (
                  <div key={index} className="position-relative z-1 d-flex flex-column align-items-center w-100" style={{ padding: '0 5px', height: '100%' }}>
                    <div className="flex-grow-1 w-100"></div>
                    <div className="position-absolute bg-dark text-white rounded px-2 py-1 small shadow tooltip-hover opacity-0 fw-bold" style={{ bottom: `calc(${data.height === '0%' ? '5px' : data.height} + 10px)`, whiteSpace: 'nowrap', transition: 'all 0.2s', pointerEvents: 'none' }}>
                       Rp {data.total.toLocaleString('id-ID')}
                    </div>
                    <div 
                       className="rounded-top w-100 shadow-sm" 
                       style={{ height: data.height === '0%' ? '5px' : data.height, background: data.height === '0%' ? '#e2e8f0' : `linear-gradient(to top, ${brandColor} 0%, #34d399 100%)`, transition: 'height 0.8s ease-out, opacity 0.2s', maxWidth: '45px', cursor: 'pointer' }}
                       onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.previousSibling.style.opacity = '1'; e.currentTarget.previousSibling.style.transform = 'translateY(-5px)'; }}
                       onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.previousSibling.style.opacity = '0'; e.currentTarget.previousSibling.style.transform = 'translateY(0)'; }}
                    ></div>
                    <span className="small text-secondary fw-bold mt-3 text-center" style={{fontSize:'0.70rem'}}>{data.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="row g-4 mb-4">
               {/* TABEL TRANSAKSI TERBARU */}
               <div className="col-lg-8">
                 <div className="bg-white rounded-4 shadow-sm border-0 p-3 p-md-4 h-100">
                   <h6 className="fw-bold mb-3 text-dark">Riwayat Transaksi Terbaru</h6>
                   {orders.length === 0 ? (
                     <div className="text-center py-5 text-muted">Belum ada data transaksi.</div>
                   ) : (
                     <div className="table-responsive hide-scrollbar">
                       <table className="table align-middle mb-0 text-nowrap">
                         <thead className="table-light text-secondary small text-uppercase fw-bold">
                           <tr><th className="py-3 px-3 rounded-start-3 border-0">ID</th><th className="py-3 border-0">Tanggal</th><th className="py-3 border-0">Status</th><th className="py-3 px-3 rounded-end-3 border-0 text-end">Pembayaran</th></tr>
                         </thead>
                         <tbody>
                           {orders.slice(0, 10).map((order) => (
                             <tr key={order.id} className="border-bottom">
                               <td className="fw-bold px-3 text-secondary">#AMBA{order.id}X</td>
                               <td><small className="fw-bold text-dark">{new Date(order.created_at).toLocaleDateString('id-ID')}</small></td>
                               <td><span className={`badge px-3 py-1.5 rounded-pill ${order.status === 'SHIPPED' || order.status === 'ARRIVED' ? 'bg-info text-dark' : order.status === 'DELIVERED' ? 'bg-success' : 'bg-secondary'}`}>{order.status === 'ARRIVED' ? 'Telah Sampai' : order.status}</span></td>
                               <td className="px-3 text-end fw-black text-dark fs-6">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                 </div>
               </div>

               {/* KARTU ULASAN PEMBELI DENGAN RATA-RATA RATING TOKO */}
               <div className="col-lg-4">
                 <div className="bg-white rounded-4 shadow-sm border-0 p-0 h-100 overflow-hidden d-flex flex-column" style={{maxHeight:'500px'}}>
                    
                    {/* Header Rating Rata-rata */}
                    <div className="p-4 border-bottom bg-light d-flex align-items-center justify-content-between">
                       <div>
                         <h6 className="fw-bold mb-1 text-dark d-flex align-items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffc107" className="me-2" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                           Rating Toko
                         </h6>
                         <span className="small text-secondary">{ratings.length} Ulasan Pembeli</span>
                       </div>
                       <h2 className="fw-black m-0 text-dark d-flex align-items-center">
                         {averageRating} <span className="fs-6 text-muted fw-bold ms-1">/ 5.0</span>
                       </h2>
                    </div>

                    <div className="p-4 overflow-auto hide-scrollbar flex-grow-1">
                      {ratings.length === 0 ? (
                         <p className="text-muted small text-center py-5">Belum ada ulasan yang diberikan.</p>
                      ) : (
                         ratings.map(r => (
                            <div key={r.id} className="p-3 bg-white rounded-4 mb-3 border shadow-sm hover-scale">
                               <div className="d-flex justify-content-between mb-1">
                                  <span className="small fw-bold text-dark text-truncate" style={{maxWidth:'70%'}}>{r.user_name || 'Pembeli'}</span>
                                  <span className="small text-muted">{new Date(r.created_at).toLocaleDateString('id-ID')}</span>
                               </div>
                               <div className="mb-2">
                                  {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill={i < r.stars ? "#ffc107" : "#e2e8f0"} className="me-1" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>)}
                               </div>
                               <p className="small text-dark fw-bold mb-1">{r.item_name}</p>
                               <p className="small text-secondary mb-2 fst-italic">"{r.review}"</p>
                               {r.photo && <img src={r.photo} alt="Review" className="img-thumbnail rounded-3" style={{width:'60px', height:'60px', objectFit:'cover'}}/>}
                            </div>
                         ))
                      )}
                    </div>
                 </div>
               </div>
            </div>
          </>
        )}
      </div>

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

export default AdminReports;