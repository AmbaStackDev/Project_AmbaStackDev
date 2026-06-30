import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero.jsx";
import Product from "../components/Product/Product.jsx";
import { getProducts } from "../utils/productApi";
import http from "../utils/http"; // <--- TAMBAH IMPORT INI
import { useOutletContext } from "react-router-dom";

function Home() {
  const { handleAddToCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // <--- STATE BARU
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // <--- UBAH activeCategory MENJADI ID (Default "ALL")
  const [activeCategoryId, setActiveCategoryId] = useState("ALL"); 

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Tarik data Kategori DULU dari Backend
        const resCat = await http.get('/categories');
        setCategories(resCat.data.data);

        // Tarik data Produk
        const response = await getProducts();
        const dataApi = response.data;
        const arrayProduk = dataApi.data || dataApi.products || dataApi;
        setProducts(arrayProduk);
      } catch (err) {
        setError(err.message || "Gagal menarik data dari server.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Dinamis Berdasarkan ID Kategori
  const filteredProducts =
    activeCategoryId === "ALL"
      ? products
      : products.filter((product) => Number(product.category_id) === Number(activeCategoryId));

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('/products/')) return imagePath.substring(imagePath.indexOf('/products/')); 
    if (imagePath.startsWith('/uploads/')) return `http://127.0.0.1:8000${imagePath}`;
    return `http://127.0.0.1:8000/uploads/${imagePath}`;
  };

  return (
    <div className="container-fluid p-0">
      <Hero />
      <div className="container px-3 px-md-4 mt-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-black text-dark mb-1">Rekomendasi Spesial</h3>
            <p className="text-secondary mb-0 fw-medium small d-none d-md-block">
              Pilihan barang terbaik khusus untuk Anda hari ini.
            </p>
          </div>
          <a href="#" className="text-brand fw-bold text-decoration-none small">Lihat Semua</a>
        </div>

        {/* KATEGORI PILLS DINAMIS DARI DATABASE */}
        <div className="d-flex overflow-auto pb-2 mb-4 hide-scrollbar gap-2">
          {/* Tombol Hardcode untuk "Semua Kategori" */}
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={`btn rounded-pill px-4 py-2 fw-semibold border shadow-sm flex-shrink-0 ${
              activeCategoryId === "ALL" ? "btn-success text-white" : "btn-light text-secondary bg-white"
            }`}
            style={activeCategoryId === "ALL" ? { backgroundColor: '#03AC0E', borderColor: '#03AC0E' } : {}}
          >
            Semua Kategori
          </button>
          
          {/* Looping tombol kategori asli dari database */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`btn rounded-pill px-4 py-2 fw-semibold border shadow-sm flex-shrink-0 ${
                activeCategoryId === cat.id ? "btn-success text-white" : "btn-light text-secondary bg-white"
              }`}
              style={activeCategoryId === cat.id ? { backgroundColor: '#03AC0E', borderColor: '#03AC0E' } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Etalase Produk */}
        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border" style={{ color: '#03AC0E' }}></div>
            <p className="mt-3 text-secondary fw-bold">Memuat katalog...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center p-4 mx-auto" style={{ maxWidth: "600px" }}>
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center my-5 py-5 mx-auto bg-light rounded-4 border shadow-sm" style={{ maxWidth: "600px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#cbd5e1" className="mb-3" viewBox="0 0 16 16">
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
            </svg>
            <h5 className="fw-bold text-dark mb-0">Oops, belum ada barang di kategori ini!</h5>
          </div>
        ) : (
          <div className="row g-2 g-md-4 mb-5">
            {filteredProducts.map((product) => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={product.id}>
                <Product
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  location={product.location || "Gudang Pusat"}
                  sold={product.sold || 0}
                  stock={product.stock}
                  image={formatImageUrl(product.image_url || product.image)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;