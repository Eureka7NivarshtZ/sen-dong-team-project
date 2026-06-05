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

      if (response.data.success && response.data.data?.token) {
        const data = response.data.data;

        localStorage.setItem("authToken", data.token);

        const userData = {
          ...data.tai_khoan,
          ...(data.nhan_vien || data.khach_hang || {}),
          loai: data.tai_khoan?.loai,
          vai_tro: data.nhan_vien?.vai_tro || data.tai_khoan?.loai,
          nhan_vien_id: data.nhan_vien?.id || null,
          khach_hang_id: data.khach_hang?.id || null,
        };

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
      const response = await apiClient.post("/auth/dang-ky", {
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
        mat_khau_moi: matKhauMoi,
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

  capNhatThongTinCuaToi: async (data) => {
    try {
      const response = await apiClient.put("/auth/thong-tin", data);

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật thông tin thất bại",
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
