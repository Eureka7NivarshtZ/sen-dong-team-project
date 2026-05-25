import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Authentication
const authService = {
  // Đăng nhập
  dangNhap: async (email, matKhau) => {
    try {
      const response = await apiClient.post("/auth/dang-nhap", {
        email,
        matKhau,
      });

      // Lưu token nếu đăng nhập thành công
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Đăng nhập thất bại",
      };
    }
  },

  // Đăng ký khách hàng
  dangKyKhachHang: async (
    ten,
    email,
    matKhau,
    soDienThoai = "",
    diaChi = "",
  ) => {
    try {
      const response = await apiClient.post("/auth/dang-ky-khach-hang", {
        ten,
        email,
        matKhau,
        soDienThoai,
        diaChi,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Đăng ký thất bại",
      };
    }
  },

  // Quên mật khẩu
  quenMatKhau: async (email) => {
    try {
      const response = await apiClient.post("/auth/quen-mat-khau", {
        email,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Yêu cầu đặt lại mật khẩu thất bại",
      };
    }
  },

  // Đặt lại mật khẩu
  datLaiMatKhau: async (token, matKhauMoi) => {
    try {
      const response = await apiClient.post("/auth/dat-lai-mat-khau", {
        token,
        matKhauMoi,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Đặt lại mật khẩu thất bại",
      };
    }
  },

  // Lấy thông tin người dùng hiện tại
  xemThongTinCuaToi: async () => {
    try {
      const response = await apiClient.get("/auth/thong-tin-cua-toi");

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy thông tin thất bại",
      };
    }
  },

  // Đăng xuất
  dangXuat: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Lấy token từ local storage
  getToken: () => localStorage.getItem("authToken"),

  // Lấy thông tin user từ local storage
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;
