import React, { useState, useEffect } from 'react';
import http from '../utils/http';

function OrderHistory() {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await http.get('/orders/history');
        if (res.data.success) setMyOrders(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyOrders();
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="fw-bold mb-4">Riwayat Belanja Saya</h2>
      {myOrders.length === 0 ? (
        <p className="text-secondary">Kamu belum pernah melakukan transaksi.</p>
      ) : (
        <div className="row g-3">
          {myOrders.map((order) => (
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-3" key={order.id}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <span className="small text-secondary">ID Transaksi: #{order.id}</span>
                <span className={`badge px-3 py-2 ${order.status === 'SHIPPED' ? 'bg-success' : 'bg-warning'}`}>{order.status}</span>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1 text-secondary small">Total Pembayaran</p>
                  <h5 className="fw-bold text-success">Rp {Number(order.total_price).toLocaleString('id-ID')}</h5>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-secondary small">Nomor Resi Pengiriman (Logistik)</p>
                  <h6 className="fw-bold text-dark">{order.tracking_number || 'Sedang diproses oleh penjual'}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;