import React, { useState, useEffect } from 'react';
import http from '../../utils/http';
import AdminNavbar from '../../components/Navbar/AdminSidebar';

function AdminWithdraw({ showToast }) {
  const [totalBalance, setTotalBalance] = useState(0); 
  const [heldBalance, setHeldBalance] = useState(0); 
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [history, setHistory] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accNumber, setAccNumber] = useState('');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [successPopup, setSuccessPopup] = useState({ show: false, message: '' });
  const [errorPopup, setErrorPopup] = useState({ show: false, message: '' });

  const brandColor = '#03AC0E';

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await http.get('/orders/admin/all');
        if (res.data.success) {
          // FIXED BUG: Saldo Aktif sekarang menghitung DELIVERED dan REFUND_REJECTED
          const delivered = res.data.data
            .filter(o => ['DELIVERED', 'REFUND_REJECTED'].includes(o.status))
            .reduce((sum, o) => sum + Number(o.total_price), 0);
            
          // Saldo Tertahan tetap untuk pesanan yang masih berjalan
          const held = res.data.data
            .filter(o => ['PENDING', 'SHIPPED', 'ARRIVED', 'RETURNED'].includes(o.status))
            .reduce((sum, o) => sum + Number(o.total_price), 0);

          setTotalBalance(delivered);
          setHeldBalance(held);
        }
      } catch (e) {}
    };
    fetchBalance();

    const localHistory = JSON.parse(localStorage.getItem('amba_withdrawals')) || [];
    setHistory(localHistory);
    
    const withdrawn = localHistory.filter(h => h.status === 'Berhasil' || h.status === 'Diproses').reduce((sum, h) => sum + Number(h.amount), 0);
    setWithdrawnAmount(withdrawn);
  }, []);

  const availableBalance = totalBalance - withdrawnAmount;

  const handleWithdrawRequest = (e) => {
    e.preventDefault();
    if (Number(amount) < 50000) return setErrorPopup({ show: true, message: 'Minimal penarikan adalah Rp 50.000' });
    if (Number(amount) > availableBalance) return setErrorPopup({ show: true, message: 'Saldo Anda tidak mencukupi untuk nominal penarikan ini.' });
    if (!bank || !accNumber) return setErrorPopup({ show: true, message: 'Silakan isi rincian Bank dan Nomor Rekening dengan lengkap.' });
    
    setShowConfirmModal(true);
  };

  const executeWithdraw = () => {
    setShowConfirmModal(false);
    setIsProcessing(true); 

    const newId = `WD-${Date.now()}`;
    const newRecord = {
      id: newId,
      amount: Number(amount),
      bank: bank,
      accNumber: accNumber,
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Diproses'
    };

    setHistory([newRecord, ...history]);

    setTimeout(() => {
      newRecord.status = 'Berhasil';
      const finalHistory = [newRecord, ...history];
      
      localStorage.setItem('amba_withdrawals', JSON.stringify(finalHistory));
      setHistory(finalHistory);
      setWithdrawnAmount(prev => prev + Number(amount));
      
      setIsProcessing(false);
      setAmount(''); setBank(''); setAccNumber('');
      setSuccessPopup({ show: true, message: 'Penarikan saldo berhasil! Dana sedang ditransfer ke rekening Anda.' });
    }, 3000);
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f4f7f6', paddingBottom: '3rem' }}>
      <AdminNavbar showToast={showToast} />
      <div className="container px-3 mt-4 mt-lg-5 pt-lg-2">
        
        <div className="rounded-4 shadow-sm position-relative border-0 mb-4 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #03AC0E 0%, #06850E 100%)', color: 'white' }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '65%', position: 'relative', zIndex: 2 }}>
            <h2 className="fw-black mb-2 fs-2 text-white">Penarikan Saldo</h2>
            <p className="mb-0 fw-medium opacity-90 text-white">Cairkan pendapatan toko Anda langsung ke rekening bank.</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="white" className="position-absolute opacity-10" style={{ right: '5%', top: '10%', zIndex: 1 }} viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border border-start border-4 border-success h-100 hover-scale">
              <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Saldo Dapat Ditarik</span>
              <h3 className="fw-black mb-0 text-success">Rp {availableBalance.toLocaleString('id-ID')}</h3>
              <p className="small text-muted mt-2 mb-0">Hanya dari pesanan selesai.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border border-start border-4 border-secondary h-100 hover-scale">
              <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Total Saldo Tertahan</span>
              <h3 className="fw-black mb-0 text-dark">Rp {heldBalance.toLocaleString('id-ID')}</h3>
              <p className="small text-muted mt-2 mb-0">Pesanan aktif yang belum selesai.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border border-start border-4 border-primary h-100 hover-scale">
              <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Total Ditarik</span>
              <h3 className="fw-black mb-0 text-dark">Rp {withdrawnAmount.toLocaleString('id-ID')}</h3>
              <p className="small text-muted mt-2 mb-0">Riwayat penarikan sukses.</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <h5 className="fw-bold mb-4 text-dark d-flex align-items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={brandColor} className="me-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/><path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                 Form Penarikan
              </h5>
              <form onSubmit={handleWithdrawRequest}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Nominal Penarikan (Rp)</label>
                  <div className="position-relative">
                    <input type="number" className="form-control bg-light border-0 p-3 shadow-sm fw-bold fs-5 text-dark" placeholder="Contoh: 150000" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ paddingRight: '120px' }} required />
                    <button type="button" onClick={() => setAmount(availableBalance)} className="btn btn-sm btn-outline-success position-absolute fw-bold" style={{ right: '10px', top: '12px', borderRadius: '8px' }}>Tarik Semua</button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Bank Tujuan</label>
                  <select className="form-select bg-light border-0 p-3 shadow-sm fw-medium text-dark" value={bank} onChange={(e) => setBank(e.target.value)} required>
                    <option value="" disabled>Pilih Bank</option>
                    <option value="BCA">BCA (Bank Central Asia)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BNI">BNI (Bank Negara Indonesia)</option>
                    <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                    <option value="GoPay">GoPay E-Wallet</option>
                    <option value="Dana">DANA E-Wallet</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Nomor Rekening / E-Wallet</label>
                  <input type="text" className="form-control bg-light border-0 p-3 shadow-sm text-dark fw-bold" placeholder="Masukkan nomor rekening..." value={accNumber} onChange={(e) => setAccNumber(e.target.value)} required />
                </div>
                <button type="submit" className="btn text-white w-100 fw-bold py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }}>
                  Tarik Saldo Sekarang
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="bg-white rounded-4 shadow-sm border p-4 h-100">
              <h5 className="fw-bold mb-4 text-dark d-flex align-items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 text-secondary" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.757.205 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/></svg>
                 Riwayat Penarikan
              </h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0 text-nowrap">
                  <thead className="table-light text-secondary small text-uppercase fw-bold">
                    <tr><th className="py-3 border-0">ID / Tanggal</th><th className="py-3 border-0">Tujuan</th><th className="py-3 border-0">Nominal</th><th className="py-3 text-end border-0">Status</th></tr>
                  </thead>
                  <tbody>
                    {history.length > 0 ? history.map((item) => (
                      <tr key={item.id} className="border-bottom">
                        <td>
                          <span className="fw-bold text-dark d-block">{item.id}</span>
                          <span className="small text-muted">{item.date}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-dark d-block">{item.bank}</span>
                          <span className="small text-secondary">{item.accNumber}</span>
                        </td>
                        <td className="fw-black text-dark">Rp {item.amount.toLocaleString('id-ID')}</td>
                        <td className="text-end">
                          <span className={`badge px-3 py-2 rounded-pill shadow-sm ${item.status === 'Berhasil' ? 'bg-success' : 'bg-warning text-dark'}`}>{item.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="text-center py-5 text-muted fw-bold">Belum ada riwayat penarikan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-4 border w-100 shadow-lg text-center" style={{ maxWidth: '400px', borderRadius: '24px' }}>
            <h4 className="fw-black text-dark mb-4">Konfirmasi Penarikan</h4>
            <div className="bg-light p-3 rounded-4 mb-4 text-start border shadow-sm">
               <p className="small text-secondary mb-1">Nominal:</p>
               <h5 className="fw-black text-dark mb-3">Rp {Number(amount).toLocaleString('id-ID')}</h5>
               <p className="small text-secondary mb-1">Tujuan:</p>
               <h6 className="fw-bold text-dark mb-0">{bank} - {accNumber}</h6>
            </div>
            <div className="d-flex gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-light fw-bold w-50 py-3 rounded-pill text-secondary border hover-scale">Batal</button>
              <button onClick={executeWithdraw} className="btn text-white fw-bold w-50 py-3 rounded-pill shadow-sm hover-scale" style={{ backgroundColor: brandColor }}>Tarik Sekarang</button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white p-5 border w-100 text-center shadow-lg d-flex flex-column align-items-center" style={{ maxWidth: '350px', borderRadius: '24px' }}>
            <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}></div>
            <h5 className="fw-bold text-dark mb-2">Memproses Penarikan...</h5>
            <p className="small text-secondary mb-0">Sistem sedang menghubungi server {bank}. Mohon jangan tutup halaman ini.</p>
          </div>
        </div>
      )}

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
        <div className="custom-modal-overlay px-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white p-4 border-0 w-100 text-center shadow-lg" style={{ maxWidth: '350px', borderRadius: '24px' }}>
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
              </div>
            </div>
            <h4 className="fw-black text-dark mb-2">Berhasil!</h4>
            <p className="text-secondary small mb-4">{successPopup.message}</p>
            <button onClick={() => setSuccessPopup({ show: false, message: '' })} className="btn text-white fw-bold w-100 py-3 rounded-pill" style={{ backgroundColor: brandColor }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWithdraw;