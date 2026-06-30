import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../utils/http';
import AdminSidebar from '../components/Navbar/AdminSidebar';

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes('admin');
  const searchParams = new URLSearchParams(location.search);
  const rawOrderId = searchParams.get('orderId') || '1';

  // AMBIL DATA ORDER DARI STATE (Dioper oleh halaman sebelumnya)
  const { state } = location;
  const [orderData, setOrderData] = useState(state?.orderData || null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // Referensi untuk fitur Smart Scroll
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevMsgLength = useRef(0); 
  const brandColor = '#03AC0E';

  // Format Helper: Standarisasi Gambar (Mencegah Gambar Blank/Gagal)
  const formatImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/50?text=No+Image';
    if (img.startsWith('http')) return img;
    if (img.includes('/products/')) return img.substring(img.indexOf('/products/')); 
    if (img.startsWith('/uploads/')) return `http://127.0.0.1:8000${img}`;
    return `http://127.0.0.1:8000/uploads/${img}`;
  };

  const generateOrderID = (id, dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `AMBA${d}${m}${y}${String(id).padStart(4, '0')}X`;
  };

  useEffect(() => {
    if (!orderData) {
       // Fallback fetch jika dibuka dari link luar
       const fetchOrder = async () => {
          const url = isAdmin ? '/orders/admin/all' : '/orders/my-orders';
          const res = await http.get(url);
          if (res.data.success) {
             const found = res.data.data.find(o => String(o.id) === String(rawOrderId));
             if (found) setOrderData(found);
          }
       };
       fetchOrder();
    }
  }, [rawOrderId, isAdmin, orderData]);

  const syncChat = async () => {
    try {
      const res = await http.get(`/chats/${rawOrderId}`);
      if(res.data.success) setMessages(res.data.data);
    } catch(err) {}
  };

  useEffect(() => {
    syncChat();
    const interval = setInterval(syncChat, 3000); 
    return () => clearInterval(interval);
  }, [rawOrderId]);

  // SMART SCROLL LOGIC: Scroll hanya jika user berada di dekat bagian bawah layar
  useEffect(() => {
    if (messages.length > prevMsgLength.current) {
      const container = chatContainerRef.current;
      if (container) {
        // Cek apakah posisi scroll user berada dalam jarak 150px dari bawah
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        
        // Scroll ke bawah HANYA JIKA ini pesan pertama dimuat ATAU user sedang di bagian bawah
        if (isNearBottom || prevMsgLength.current === 0) {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      prevMsgLength.current = messages.length;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const senderRole = isAdmin ? 'admin' : 'user';
    await http.post('/chats', { order_id: rawOrderId, message: input, sender_role: senderRole });
    
    setInput('');
    syncChat(); 
    window.dispatchEvent(new Event('notifUpdate')); // Memicu notifikasi tab lain
    
    // Paksa scroll saat kita yang mengirim pesan
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const buyerName = orderData ? (orderData.shipping_address.includes('|') ? orderData.shipping_address.split('|')[1].split('(')[0].trim() : 'Pembeli') : 'Pembeli';
  const displayId = orderData ? generateOrderID(orderData.id, orderData.created_at) : `AMBA...${rawOrderId}X`;

  return (
    <div className="min-vh-100 d-flex flex-column" style={isAdmin ? { background: '#f4f7f6' } : {}}>
      {isAdmin && <AdminSidebar />}

      <div className="container mt-4 mb-5 flex-grow-1 d-flex flex-column" style={{ maxWidth: '800px', paddingTop: isAdmin ? '10px' : '0' }}>
        <div className="bg-white rounded-4 shadow-sm border d-flex flex-column flex-grow-1" style={{ height: '75vh', minHeight: '500px' }}>
          
          {/* HEADER CHAT */}
          <div className="p-3 border-bottom d-flex align-items-center bg-light z-2" style={{ borderRadius: '16px 16px 0 0' }}>
            <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle me-3 border shadow-sm px-2 py-1 hover-scale">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
            </button>
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm" style={{width:'45px', height:'45px'}}>
                 {isAdmin ? 'PBL' : 'ADM'}
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">{isAdmin ? buyerName : 'AmbaCart Official Store'}</h5>
                <span className="small text-success fw-bold d-flex align-items-center"><span className="bg-success rounded-circle me-1" style={{ width: '8px', height: '8px' }}></span> Online</span>
              </div>
            </div>
          </div>

          {/* HEADER INFO BARANG YG DIBELI BISA DI KLIK (UX IMPROVEMENT) */}
          {orderData && (
            <div 
              className="bg-white p-3 border-bottom d-flex align-items-center shadow-sm z-1 hover-bg-light" 
              style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              onClick={() => navigate(isAdmin ? '/admin/orders' : '/order-history')}
              title="Klik untuk melihat rincian pesanan"
            >
               <img src={formatImageUrl(orderData.items?.[0]?.image_url || orderData.items?.[0]?.image)} style={{width: 50, height: 50, objectFit: 'contain'}} className="rounded border p-1 me-3 shadow-sm bg-white" alt="Produk" />
               <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 text-dark text-truncate" style={{maxWidth:'90%'}}>{orderData.items?.[0]?.name || 'Produk'}</h6>
                  <span className="small text-secondary fw-bold d-flex align-items-center">
                    ID Pesanan: {displayId} 
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="ms-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
                  </span>
               </div>
               <div className="text-end">
                   <span className="badge bg-light text-dark border px-3 py-2 shadow-sm">{orderData.status}</span>
               </div>
            </div>
          )}

          {/* BODY CHAT (Dengan Ref untuk Smart Scroll) */}
          <div className="flex-grow-1 p-3 p-md-4 overflow-auto hide-scrollbar" style={{ backgroundColor: '#f8fafc' }} ref={chatContainerRef}>
            {messages.length === 0 && (
              <div className="text-center text-muted mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/></svg>
                <p className="fw-bold">Belum ada pesan. Mulai percakapan sekarang!</p>
              </div>
            )}

            {messages.map(msg => {
              const isMe = (isAdmin && msg.sender_role === 'admin') || (!isAdmin && msg.sender_role === 'user');
              return (
                <div key={msg.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'text-white' : 'bg-white text-dark border'}`} style={{ backgroundColor: isMe ? brandColor : 'white', maxWidth: '85%', borderBottomRightRadius: isMe ? '4px' : '16px', borderBottomLeftRadius: !isMe ? '4px' : '16px' }}>
                    <p className="mb-1" style={{ fontSize: '1rem', lineHeight: '1.4', wordBreak: 'break-word' }}>{msg.message}</p>
                    <div className={`small ${isMe ? 'text-white-50' : 'text-muted'} text-end`} style={{ fontSize: '0.70rem', marginTop: '4px' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="ms-1" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} style={{ height: '10px' }} />
          </div>

          {/* INPUT CHAT */}
          <form onSubmit={handleSend} className="p-3 bg-white border-top d-flex gap-2 align-items-center" style={{ borderRadius: '0 0 16px 16px' }}>
            <input type="text" className="form-control rounded-pill px-4 bg-light border-0 py-3 shadow-sm" placeholder="Ketik pesan Anda..." value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
            <button type="submit" className="btn rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm hover-scale" style={{ width: '54px', height: '54px', backgroundColor: brandColor, border: 'none' }} disabled={!input.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '-2px' }}><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/></svg>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Chat;