import http from "./http";

export function getProducts() {
  return http.get("/products");
}

export function getProductById(id) {
  return http.get(`/products/${id}`);
}

export function createProduct(formData) {
  return http.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function updateProduct(id, formData) {
  return http.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteProduct(id) {
  return http.delete(`/products/${id}`);
}