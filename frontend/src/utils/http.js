import axios from 'axios';

const http = axios.create({
  // Tetap gunakan IP ini agar terhindar dari bentrok IPv6 (::1)
  baseURL: 'http://127.0.0.1:8000/api', 
});

// INTERCEPTOR: Menyisipkan token ke setiap request
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    
    // FIXED: Cegah pengiriman token fiktif (null/undefined/kosong)
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;