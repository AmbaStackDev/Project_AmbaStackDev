import React from 'react';

function SizeAlertModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div 
      className="px-3" 
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        backdropFilter: 'blur(3px)' 
      }}
    >
      <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
        <div className="mb-3 text-warning d-flex justify-content-center">
          <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </div>
        </div>
        <h4 className="fw-black text-dark mb-2">Ukuran Terlalu Besar!</h4>
        <p className="text-secondary small mb-4 px-2">Foto yang Anda pilih melebihi batas maksimal <b>2MB</b>. Silakan kompres foto Anda atau pilih foto lain yang berukuran lebih kecil.</p>
        <button onClick={onClose} className="btn btn-warning text-dark fw-bold w-100 py-2.5 rounded-pill shadow-sm">Mengerti</button>
      </div>
    </div>
  );
}

export default SizeAlertModal;