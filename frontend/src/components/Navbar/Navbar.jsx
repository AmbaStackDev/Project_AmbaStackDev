import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Import CSS spesifik Navbar
import logoImg from '../../assets/logo.png'; // Perhatikan penambahan ../ karena masuk sub-folder

function Navbar({ cartCount }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400); 
    }
  }, [cartCount]);

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3 glass-navbar shadow-sm mx-3 mt-3 px-3" style={{ top: '15px', zIndex: 1030 }}>
      <div className="container-fluid">
        <a className="navbar-brand fw-bolder text-brand fs-4 d-flex align-items-center" href="#">
          <img src={logoImg} alt="AmbaCart Logo" height="38" className="me-2" />
          AmbaCart
        </a>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form className="d-flex mx-auto w-100 my-3 my-lg-0 px-lg-4" style={{ maxWidth: '550px' }}>
            <div className="input-group flat-search-group w-100">
              <input 
                className="form-control flat-input border-0 px-4 py-2 shadow-none" 
                type="search" 
                placeholder="Cari produk elektronik, gadget, pakaian..." 
              />
              <button className="btn bg-white border-0 px-3 text-secondary" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <a className="nav-link fw-bold text-dark" href="#">Masuk</a>
            </li>
            <li className="nav-item mt-2 mt-lg-0">
              <button className="btn flat-btn-brand d-flex align-items-center justify-content-center gap-2 px-4 py-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" height="18" fill="currentColor" viewBox="0 0 16 16" 
                  className={`me-1 ${isAnimating ? 'animate-pop' : ''}`}
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span className="fw-bold">Keranjang</span>
                {cartCount > 0 && (
                  <span className="badge bg-white text-brand ms-2 rounded-pill px-2 py-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;