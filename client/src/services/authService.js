import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Authentication
const authService = {
  // Đăng nhập
  dangNhap: async (email, mat_khau) => {
    try {
      const response = await apiClient.post("/auth/dang-nhap", {
        email,
        mat_khau,
      });

      // Lưu token nếu đăng nhập thành công
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("authToken", response.data.data.token);
        const userData =
          response.data.data.nhan_vien ||
          response.data.data.khach_hang ||
          response.data.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
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
        ho_ten: ten,
        email,
        mat_khau: matKhau,
        sdt: soDienThoai,
        dia_chi: diaChi,
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
      const response = await apiClient.get("/auth/thong-tin");

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

    if (!user || user === "undefined") {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Lỗi parse user từ localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;
