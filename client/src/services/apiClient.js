import axios from "axios";

// Tạo instance axios với config chung
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Thay đổi port theo cấu hình backend của bạn
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Thêm token vào header nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Có thể redirect tới login page
      window.location.href = "/login";
    }

    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error("Bạn không có quyền truy cập");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
