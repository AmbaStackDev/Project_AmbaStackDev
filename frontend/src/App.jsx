import { useState, useEffect } from 'react';
import { getProducts } from './utils/productApi';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Product from './components/Product';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await getProducts();
        if (response && response.data) {
          setProducts(response.data.data);
        }
      } catch (err) {
        setError(err.message || 'Gagal menarik data dari server');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["Semua Kategori", "Elektronik", "Fashion & Aksesoris", "Peralatan Rumah", "Olahraga & Hobi"];

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  const handleAddProduct = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newProduct = {
      id: Date.now(),
      name: "Smart Gadget Premium Special Edition v." + randomId,
      price: 1250000,
      location: "Gudang Utama",
      sold: 0,
      image: `https://picsum.photos/300/300?random=${randomId}`
    };
    setProducts([...products, newProduct]);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartCount={cartCount} />
      
      <main className="container-fluid flex-grow-1 px-3 px-md-5 mt-2">
        <Hero />

        <div className="mb-5 d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-bold me-2 text-dark fs-5">Kategori:</span>
          {categories.map((cat, index) => (
            <div key={index} className="flat-category-item">
              {cat}
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bolder text-dark fs-3 mb-0" style={{ letterSpacing: '-0.5px' }}>
            Katalog Produk Pilihan
          </h4>
          <button onClick={handleAddProduct} className="btn flat-btn-brand px-4 py-2 shadow-sm d-flex align-items-center gap-2">
            <span className="fs-5 fw-bold">+</span> Tambah Dummy
          </button>
        </div>
        
        <div className="row g-4 mb-5">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={product.id}>
              <Product 
                name={product.name} 
                price={product.price} 
                location={product.location || "Gudang Pusat"}
                sold={product.sold || 0}
                image={product.image_url || product.image || `https://picsum.photos/300/300?random=${product.id}`}
                onAddToCart={handleAddToCart} 
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