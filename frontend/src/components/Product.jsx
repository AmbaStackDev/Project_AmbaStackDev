import React from 'react';

function Product({ name, price, image }) {
    return (
        <div className="card h-100 shadow-sm border-0">
            {/* Tag img wajib ditutup (self-closing tag di JSX) */}
            <img
                src={image}
                className="card-img-top"
                alt={name}
                style={{ height: '220px', objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title text-truncate fw-bold">{name}</h5>
                <p className="card-text text-danger fs-5 fw-bold mb-4">
                    Rp {price.toLocaleString('id-ID')}
                </p>
                {/* Tombol diletakkan di bawah agar sejajar berkat mt-auto */}
                <button className="btn btn-success w-100 mt-auto fw-semibold">
                    + Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}

export default Product;