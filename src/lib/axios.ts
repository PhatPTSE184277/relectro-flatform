import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("ewise_token") || sessionStorage.getItem("ewise_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Xóa token ngay lập tức
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ewise_token');
        sessionStorage.removeItem('ewise_token');
        localStorage.removeItem('ewise_processing_time');
        
        // Dispatch event để Redux cập nhật
        const event = new CustomEvent('auth:logout');
        window.dispatchEvent(event);
        
        // Redirect ngay lập tức, không chờ gì hết
        setTimeout(() => {
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;