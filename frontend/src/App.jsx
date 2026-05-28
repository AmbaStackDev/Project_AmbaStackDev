import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import Product from './components/Product/Product.jsx';
import Footer from './components/Footer/Footer.jsx';
import { getProducts } from './utils/productApi';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  // STATE MANAGEMENT
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["Semua Kategori", "Elektronik", "Fashion & Aksesoris", "Peralatan Rumah", "Olahraga & Hobi"];

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  // PEMANGGILAN API ASINKRON
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await getProducts();
        
        console.log("🔍 CEK DATA DARI BACKEND:", response.data);

        const dataApi = response.data;
        const arrayProduk = dataApi.data || dataApi.products || dataApi;
        setProducts(arrayProduk);
      } catch (err) {
        setError(err.message || 'Gagal menarik data dari server');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartCount={cartCount} />
      
      <main className="container-fluid flex-grow-1 px-3 px-md-5 mt-4">
        <Hero />

        {/* SECTION KATEGORI */}
        <div className="mb-5 d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-bold me-2 text-dark fs-5">Kategori:</span>
          {categories.map((cat, index) => (
            <div key={index} className="flat-category-item">
              {cat}
            </div>
          ))}
        </div>

        {/* KATALOG HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bolder text-dark fs-3 mb-0" style={{ letterSpacing: '-0.5px' }}>
            Katalog Produk Pilihan
          </h4>
        </div>
        
        {/* ========================================================
            BLOK RENDER BERSYARAT (LOADING / ERROR / KOSONG / SUKSES)
            ======================================================== */}
        {loading ? (
          // 1. STATE LOADING
          <div className="text-center my-5 py-5 glass-panel shadow-sm mx-auto" style={{ borderRadius: '16px', maxWidth: '600px' }}>
            <div className="spinner-border text-brand mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="fs-5 fw-bold text-dark mb-0">Sinkronisasi data etalase AmbaCart...</p>
          </div>
        ) : error ? (
          // 2. STATE ERROR
          <div className="alert alert-danger shadow-sm border-0 text-center p-4 rounded-3 my-4 mx-auto d-flex flex-column align-items-center" style={{ maxWidth: '600px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-triangle-fill mb-3" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <h5 className="fw-bold mb-1">Koneksi Terputus</h5>
            <p className="mb-0 fw-medium">{error}.</p>
          </div>
        ) : products.length === 0 ? (
          // 3. STATE KOSONG (EMPTY STATE)
          <div className="text-center my-5 py-5 empty-state-glass shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-3">
              <span style={{ fontSize: '4rem' }}>📭</span>
            </div>
            <h4 className="fw-bold text-dark mb-2">Oops, etalase sedang kosong!</h4>
            <p className="text-secondary mb-4 px-4">Produk yang kamu cari mungkin sedang habis atau belum ditambahkan oleh Admin AmbaCart.</p>
            <button className="btn flat-btn-brand px-4 py-2 fw-medium" onClick={() => window.location.reload()}>
              Segarkan Halaman
            </button>
          </div>
        ) : (
          // 4. STATE SUKSES (GRID PRODUK)
          <div className="row g-4 mb-5">
            {products.map((product) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={product.id}>
                <Product 
                  name={product.name} 
                  price={product.price} 
                  location={product.location || "Gudang Pusat"}
                  sold={product.sold || 0}
                  image={
                    product.image_url
                      ? (product.image_url.startsWith('http')
                          ? product.image_url 
                          : (product.image_url.includes('/products/')
                              ? product.image_url.split('/uploads/').pop() 
                              : `http://localhost:8000${product.image_url}` 
                            )
                        )
                      : `https://picsum.photos/300/300?random=${product.id}`
                  }
                  onAddToCart={handleAddToCart} 
                />
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default App;