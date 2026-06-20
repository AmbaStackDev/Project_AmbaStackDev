import axios from 'axios';

const http = axios.create({
  // FIXED: Gunakan relative path agar otomatis ditangani oleh Proxy Vite
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Otomatis kirim token di setiap request
http.interceptors.request.use(
  (config) => {
    // Ambil token sesi yang disimpan saat login sukses
    const token = localStorage.getItem('token'); 
    
    if (token) {
      // Masukkan token ke dalam header Authorization sesuai standar Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;