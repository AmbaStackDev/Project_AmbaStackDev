import http from './http';

export function getProducts() {
  return http.get('/products');
}
export function createProduct(formData) {
  return http.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
}
  });
}