import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Tự động gắn Access Token vào mỗi yêu cầu gửi đi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Bắt lỗi 401 để tự động làm mới token bằng Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ bắt lỗi 401 Unauthorized và đảm bảo yêu cầu chưa từng retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // Bỏ qua các API phục vụ đăng nhập hoặc làm mới token để tránh lặp vô hạn
      if (originalRequest.url.includes('/auth/login/') || originalRequest.url.includes('/auth/refresh/')) {
        return Promise.reject(error);
      }

      // Nếu đang có một tiến trình refresh token chạy song song, đợi nó hoàn thành
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Không tìm thấy Refresh Token, xóa bộ nhớ và yêu cầu đăng nhập lại
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Gọi thẳng axios gốc để bỏ qua bộ chặn tự động đính kèm token bị lỗi
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Lưu thông tin token mới
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        isRefreshing = false;
        processQueue(null, accessToken);

        // Gửi lại yêu cầu ban đầu với Access Token mới
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Làm mới thất bại (Refresh Token hết hạn), đăng xuất người dùng
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
