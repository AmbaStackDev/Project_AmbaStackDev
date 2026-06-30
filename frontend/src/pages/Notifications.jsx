import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../utils/http';
import AdminSidebar from '../components/Navbar/AdminSidebar';

function Notifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes('admin');
  const [notifs, setNotifs] = useState([]);
  const brandColor = '#03AC0E';

  const fetchNotifs = async () => {
    try {
      const res = await http.get('/notifications');
      if(res.data.success) setNotifs(res.data.data);
    } catch (e) {}
  };

  useEffect(() => { 
    fetchNotifs(); 
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const clearAll = async () => {
    if(!window.confirm("Hapus semua riwayat notifikasi?")) return;
    try {
      await http.delete('/notifications');
      setNotifs([]);
      window.dispatchEvent(new Event('notifUpdate'));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await http.put('/notifications/read');
      fetchNotifs();
      window.dispatchEvent(new Event('notifUpdate'));
    } catch (e) {}
  };

  const handleNotifClick = async (notif) => {
    try {
      await http.put('/notifications/read'); 
      window.dispatchEvent(new Event('notifUpdate'));
    } catch(e) {}

    // PENDETEKSI NOMOR ORDER YANG SANGAT AKURAT (Mencari angka murni setelah tanda #)
    const match = notif.message.match(/#(\d+)/) || notif.title.match(/#(\d+)/);
    const orderId = match ? match[1] : '';

    // LOGIKA PINTAR: Jika notifikasi mengandung kata Chat atau Pesan, Bawa ke Halaman Chat!
    const isChat = notif.title.toLowerCase().includes('chat') || notif.message.toLowerCase().includes('pesan baru') || notif.message.toLowerCase().includes('membalas');

    if (isChat && orderId) {
      navigate(isAdmin ? `/admin/chat?orderId=${orderId}` : `/chat?orderId=${orderId}`);
    } else {
      navigate(isAdmin ? `/admin/orders` : `/order-history`);
    }
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('chat') || t.includes('pesan baru')) return { icon: <><path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/></>, color: '#0dcaf0', bg: '#cff4fc' };
    if (t.includes('batal') || t.includes('tolak')) return { icon: <><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></>, color: '#dc3545', bg: '#f8d7da' };
    if (t.includes('selesai') || t.includes('terima') || t.includes('setuju')) return { icon: <><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></>, color: '#198754', bg: '#d1e7dd' };
    if (t.includes('refund')) return { icon: <><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></>, color: '#ffc107', bg: '#fff3cd' };
    return { icon: <><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.958l-7.19 2.876a1.5 1.5 0 0 1-1.162 0l-7.19-2.876A1 1 0 0 1 0 12.162V3.5a.5.5 0 0 1 .314-.464z"/></>, color: brandColor, bg: '#f0fdf4' };
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <div className="min-vh-100 d-flex flex-column" style={isAdmin ? { background: '#f4f7f6' } : {}}>
      {isAdmin && <AdminSidebar />}

      <div className="container mt-4 mb-5 flex-grow-1" style={{ maxWidth: '750px', paddingTop: isAdmin ? '10px' : '0' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-black text-dark m-0 d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill={brandColor} className="me-2" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/></svg>
            Notifikasi {isAdmin ? 'Toko' : 'Saya'}
          </h3>
          <div className="d-flex gap-2">
            {unreadCount > 0 && <button onClick={markAllRead} className="btn btn-sm btn-light border rounded-pill fw-bold px-3 shadow-sm hover-scale text-secondary">Tandai Dibaca</button>}
            <button onClick={clearAll} className="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3 shadow-sm hover-scale">Bersihkan</button>
          </div>
        </div>

        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
          {notifs.length === 0 ? (
            <div className="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/></svg>
              <h5 className="text-muted fw-bold">Belum ada notifikasi baru</h5>
            </div>
          ) : (
            notifs.map(n => {
              const iconData = getIcon(n.title);
              return (
                <div key={n.id} onClick={() => handleNotifClick(n)} className={`p-4 border-bottom d-flex align-items-start hover-bg-light position-relative`} style={{ transition: 'background 0.2s', cursor: 'pointer', backgroundColor: !n.is_read ? '#f0fdf4' : 'white' }}>
                  
                  {!n.is_read && (
                    <div className="position-absolute bg-danger rounded-circle shadow-sm" style={{ width: '10px', height: '10px', top: '24px', left: '12px' }}></div>
                  )}

                  <div className="p-3 rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: iconData.bg, color: iconData.color, width: '48px', height: '48px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                      {iconData.icon}
                    </svg>
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className={`mb-0 text-dark ${!n.is_read ? 'fw-black' : 'fw-bold'}`}>{n.title}</h6>
                      <span className="text-muted small fw-medium text-nowrap ms-2" style={{fontSize: '0.75rem'}}>
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`small mb-0 lh-base ${!n.is_read ? 'text-dark fw-medium' : 'text-secondary'}`}>{n.message}</p>
                    <span className="badge bg-light text-secondary border mt-2 px-2 py-1 shadow-sm">
                      Klik untuk melihat detail &rarr;
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;