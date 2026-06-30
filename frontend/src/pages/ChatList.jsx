import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import http from '../utils/http';
import AdminSidebar from '../components/Navbar/AdminSidebar';

function ChatList() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const brandColor = '#03AC0E';

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await http.get('/chats/list/all');
        if (res.data.success) setChatRooms(res.data.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchChatList();
  }, []);

  const parseName = (addressString) => {
    if (isAdmin && addressString && addressString.includes('|')) {
      return addressString.split('|')[1].split('(')[0].trim();
    }
    return 'AmbaCart Official Store';
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={isAdmin ? { background: '#f4f7f6' } : {}}>
      {isAdmin && <AdminSidebar />}

      <div className="container mt-4 mb-5 flex-grow-1" style={{ maxWidth: '750px', paddingTop: isAdmin ? '10px' : '0' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-black text-dark m-0 d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill={brandColor} className="me-2" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326z"/></svg>
            Pesan {isAdmin ? 'Masuk' : 'Saya'}
          </h3>
        </div>

        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
          ) : chatRooms.length === 0 ? (
            <div className="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/></svg>
              <h5 className="text-muted fw-bold">Belum ada obrolan</h5>
            </div>
          ) : (
            chatRooms.map(room => (
              <div key={room.order_id} onClick={() => navigate(isAdmin ? `/admin/chat?orderId=${room.order_id}` : `/chat?orderId=${room.order_id}`)} className="p-4 border-bottom d-flex align-items-center hover-bg-light" style={{ cursor: 'pointer', transition: 'background 0.2s' }}>
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                  {isAdmin ? 'PBL' : 'ADM'}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0 text-dark">{parseName(room.shipping_address)}</h6>
                    <span className="text-muted small" style={{fontSize: '0.75rem'}}>
                      {new Date(room.last_time).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="small text-secondary mb-0 text-truncate" style={{ maxWidth: '80%' }}>
                      {room.last_message || 'Tidak ada pesan.'}
                    </p>
                    <span className="badge bg-light text-secondary border ms-2">Order #{room.order_id}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;