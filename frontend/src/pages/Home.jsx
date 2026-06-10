import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero.jsx";
import Product from "../components/Product/Product.jsx";
import { getProducts } from "../utils/productApi";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { handleAddToCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "Semua Kategori",
    "Elektronik",
    "Fashion & Aksesoris",
    "Peralatan Rumah",
    "Olahraga & Hobi",
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
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

        {/* Kategori Pills */}
        <div className="d-flex overflow-auto pb-2 mb-4 hide-scrollbar gap-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`btn rounded-pill px-4 py-2 fw-semibold border shadow-sm flex-shrink-0 ${
                idx === 0 ? "btn-success" : "btn-light text-secondary bg-white"
              }`}
              style={idx === 0 ? { backgroundColor: '#03AC0E', borderColor: '#03AC0E' } : {}}
            >
              {cat}
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
        ) : products.length === 0 ? (
          <div className="text-center my-5 py-5 mx-auto" style={{ maxWidth: "600px" }}>
            <h4 className="fw-bold text-dark">Oops, etalase sedang kosong!</h4>
          </div>
        ) : (
          <div className="row g-2 g-md-4 mb-5">
            {products.map((product) => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={product.id}>
                <Product
                  id={product.id} /* <--- SANGAT PENTING UNTUK LINK DETAIL */
                  name={product.name}
                  price={product.price}
                  location={product.location || "Gudang Pusat"}
                  sold={product.sold || 0}
                  stock={product.stock}
                  image={
                    product.image_url
                      ? product.image_url.startsWith("http")
                        ? product.image_url
                        : product.image_url.includes("/products/")
                        ? product.image_url.split("/uploads/").pop()
                        : `http://localhost:8000${product.image_url}`
                      : `https://picsum.photos/300/300?random=${product.id}`
                  }
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