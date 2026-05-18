import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Product from './components/Product';

function App() {
  // 1. Inisialisasi State Data Produk
  const [products, setProducts] = useState([
    { id: 1, name: "Parfum Baccarat", price: 150000, image: "https://picsum.photos/400/300?random=1" },
    { id: 2, name: "Parfum Vanilla", price: 120000, image: "https://picsum.photos/400/300?random=2" },
    { id: 3, name: "Parfum Amba Mewah", price: 250000, image: "https://picsum.photos/400/300?random=3" },
    { id: 4, name: "Pomade Amba Original", price: 75000, image: "https://picsum.photos/400/300?random=4" }
  ]);

  // 2. Event Handler Tombol
  function handleAddProduct() {
    const newProduct = {
      id: Date.now(),
      name: "Produk Acak " + Math.floor(Math.random() * 100),
      price: 85000,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`
    };
    setProducts([...products, newProduct]);
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Konten Utama menggunakan Container Bootstrap */}
      <main className="container flex-grow-1 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h2 className="fw-bold text-dark">Katalog Tersedia</h2>
          <button onClick={handleAddProduct} className="btn btn-primary shadow-sm">
            + Tambah Produk Dummy
          </button>
        </div>

        {/* 3. Rendering List dengan Grid System Bootstrap */}
        <div className="row g-4">
          {products.map((product) => (
            // col-lg-3: Tampil 4 produk sejajar di layar laptop
            // col-md-4: Tampil 3 produk sejajar di tablet
            // col-sm-6: Tampil 2 produk sejajar di HP
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <Product 
                name={product.name} 
                price={product.price} 
                image={product.image} 
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;