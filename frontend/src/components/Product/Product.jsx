import React from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORT LINK
import './Product.css'; 

function Product({ id, name, price, image, location, stock, onAddToCart }) {
  return (
    <div className="glass-card h-100 d-flex flex-column p-2 p-sm-3 product-card-hover bg-white bg-opacity-75">
      
      {/* Gambar Bisa Diklik menuju Detail */}
      <Link to={`/product/${id}`} className="rounded-3 overflow-hidden mb-2 mb-md-3 bg-white d-flex align-items-center justify-content-center product-img-box text-decoration-none" style={{ cursor: 'pointer' }}>
        <img 
          src={image} 
          className="img-fluid w-100 h-100 product-card-img" 
          alt={name} 
          style={{ transition: 'transform 0.3s' }} 
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} 
        />
      </Link>
      
      {/* Informasi Detil Produk */}
      <div className="card-body p-1 p-sm-0 d-flex flex-column text-start">
        
        {/* Judul Bisa Diklik menuju Detail */}
        <Link to={`/product/${id}`} className="text-decoration-none">
          <h6 className="fw-semibold text-dark mb-1 lh-sm product-title-text" title={name} style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#03AC0E'} onMouseOut={e => e.currentTarget.style.color = '#212529'}>
            {name}
          </h6>
        </Link>
        
        <h5 className="fw-bold text-brand mb-2 mt-1 product-price-text" style={{ color: '#03AC0E' }}>
          Rp {Number(price).toLocaleString('id-ID')}
        </h5>
        
        <div className="d-flex align-items-center mb-2">
          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-0.5 fw-bold label-ongkir">
            Bebas Ongkir
          </span>
        </div>
        
        <p className="mb-2 text-secondary fw-medium d-flex align-items-center gap-1 location-text small">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-geo-alt-fill text-danger flex-shrink-0" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
          </svg>
          <span className="text-truncate">{location}</span>
        </p>
      </div>
      
      {/* Indikator Stok */}
      <div className="mt-2 mb-2">
        {stock > 0 ? (
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 small" style={{ color: '#03AC0E' }}>
            Tersedia: {stock} Pcs
          </span>
        ) : (
          <span className="badge bg-danger text-white blink-animation small shadow-sm">
            STOK HABIS
          </span>
        )}
      </div>

      {/* Tombol Add to Cart */}
      <div className="mt-auto pt-1 pt-sm-2">
        <button 
          onClick={onAddToCart} 
          disabled={stock <= 0} 
          className="btn w-100 py-1.5 py-sm-2 fw-semibold rounded-3 text-truncate btn-add-cart-text shadow-sm"
          style={{ background: stock > 0 ? '#03AC0E' : '#e9ecef', color: stock > 0 ? 'white' : '#adb5bd' }}
        >
          {stock > 0 ? "+ Keranjang" : "Kosong"}
        </button>
      </div>
    </div>
  );
}

export default Product;