import React, { useState, useEffect } from 'react';
import http from '../utils/http';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [trackingInput, setTrackingInput] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await http.get('/orders/admin');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const res = await http.put(`/orders/status/${orderId}`, {
        status: 'SHIPPED',
        tracking_number: trackingInput[orderId] || ''
      });
      if (res.data.success) {
        alert('Resi berhasil diperbarui!');
        fetchOrders();
      }
    } catch (err) {
      alert('Gagal memperbarui status');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Dashboard Pesanan Pelanggan (Admin)</h2>
      <div className="table-responsive">
        <table className="table table-bordered bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID Pesanan</th>
              <th>User ID</th>
              <th>Total Harga</th>
              <th>Alamat Pengiriman</th>
              <th>Status</th>
              <th>No. Resi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                <td>{order.shipping_address}</td>
                <td><span className={`badge ${order.status === 'SHIPPED' ? 'bg-success' : 'bg-warning'}`}>{order.status}</span></td>
                <td>{order.tracking_number || '-'}</td>
                <td>
                  {order.status !== 'SHIPPED' && (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Masukkan Nomor Resi"
                        onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                      />
                      <button className="btn btn-sm btn-success text-white fw-bold" onClick={() => handleUpdateStatus(order.id)}>
                        Kirim
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;