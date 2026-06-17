import React from 'react';

function AuthAlertModal({ show, type, title, message, onClose }) {
  if (!show) return null;

  const isSuccess = type === 'success';
  const themeColor = isSuccess ? '#03AC0E' : '#dc3545';
  const bgOpacityClass = isSuccess ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10';

  return (
    <div 
      className="px-3" 
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="bg-white p-4 p-md-5 border w-100 text-center shadow-lg" style={{ maxWidth: '400px', borderRadius: '24px' }}>
        <div className="mb-3 d-flex justify-content-center">
          <div className={`p-3 rounded-circle ${bgOpacityClass}`} style={{ color: themeColor }}>
            {isSuccess ? (
              /* Ikon Centang Sukses */
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            ) : (
              /* Ikon Silang Gagal / Error */
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 1 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            )}
          </div>
        </div>
        
        <h4 className="fw-black text-dark mb-2">{title}</h4>
        <p className="text-secondary small mb-4 px-2 lh-base">{message}</p>
        
        <button 
          onClick={onClose} 
          className="btn text-white fw-bold w-100 py-2.5 rounded-pill shadow-sm"
          style={{ backgroundColor: themeColor, border: 'none', transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.9)'}
          onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          {isSuccess ? 'Lanjutkan' : 'Coba Lagi'}
        </button>
      </div>
    </div>
  );
}

export default AuthAlertModal;