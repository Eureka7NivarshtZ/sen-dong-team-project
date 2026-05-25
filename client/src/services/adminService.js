import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Admin Dashboard & Management
const adminService = {
  // ========== DASHBOARD ENDPOINTS ==========

  // Lấy thông tin tổng quan dashboard
  layDashboardTongQuan: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy thông tin dashboard thất bại",
      };
    }
  },

  // Lấy đơn hàng gần đây
  layDonHangGanDay: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/don-hang-gan-day");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy đơn hàng gần đây thất bại",
      };
    }
  },

  // Lấy biểu đồ doanh thu theo tháng
  layDoanhThuTheoThang: async (nam = null) => {
    try {
      const params = nam ? { nam } : {};
      const response = await apiClient.get(
        "/admin/dashboard/doanh-thu-theo-thang",
        { params },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy doanh thu thất bại",
      };
    }
  },

  // ========== KHÁCH HÀNG MANAGEMENT ==========

  // Xem tất cả khách hàng
  layTatCaKhachHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/khach-hang", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách khách hàng thất bại",
      };
    }
  },

  // Xem chi tiết khách hàng
  layChiTietKhachHang: async (id) => {
    try {
      const response = await apiClient.get(`/admin/khach-hang/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy chi tiết khách hàng thất bại",
      };
    }
  },

  // Khóa khách hàng
  khoaKhachHang: async (id) => {
    try {
      const response = await apiClient.put(`/admin/khach-hang/${id}/khoa`, {});
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Khóa khách hàng thất bại",
      };
    }
  },

  // ========== NHÂN VIÊN MANAGEMENT ==========

  // Xem tất cả nhân viên
  layTatCaNhanVien: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/nhan-vien", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách nhân viên thất bại",
      };
    }
  },

  // Xem chi tiết nhân viên
  layChiTietNhanVien: async (id) => {
    try {
      const response = await apiClient.get(`/admin/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết nhân viên thất bại",
      };
    }
  },

  // Thêm nhân viên mới
  themNhanVien: async (nhanVienData) => {
    try {
      const response = await apiClient.post("/admin/", nhanVienData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm nhân viên thất bại",
      };
    }
  },

  // Cập nhật nhân viên
  capNhatNhanVien: async (id, nhanVienData) => {
    try {
      const response = await apiClient.put(
        `/admin/nhan-vien/${id}`,
        nhanVienData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật nhân viên thất bại",
      };
    }
  },

  // Khóa/Mở khóa nhân viên
  khoaMoNhanVien: async (id) => {
    try {
      const response = await apiClient.patch(
        `/admin/nhan-vien/${id}/khoa-mo`,
        {},
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Khóa/Mở nhân viên thất bại",
      };
    }
  },

  // Đổi mật khẩu nhân viên
  doiMatKhauNhanVien: async (id, matKhauMoi) => {
    try {
      const response = await apiClient.patch(
        `/admin/nhan-vien/${id}/doi-mat-khau`,
        { matKhauMoi },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Đổi mật khẩu nhân viên thất bại",
      };
    }
  },

  // Xóa nhân viên
  xoaNhanVien: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa nhân viên thất bại",
      };
    }
  },

  // ========== ĐƠN VỊ VẬN CHUYỂN MANAGEMENT ==========

  // Lấy tất cả đơn vị vận chuyển
  layTatCaDonViVanChuyen: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/don-vi-van-chuyen/", {
        params,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy danh sách đơn vị vận chuyển thất bại",
      };
    }
  },

  // Lấy chi tiết đơn vị vận chuyển
  layChiTietDonViVanChuyen: async (id) => {
    try {
      const response = await apiClient.get(`/admin/don-vi-van-chuyen/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy chi tiết đơn vị vận chuyển thất bại",
      };
    }
  },

  // Thêm đơn vị vận chuyển
  themDonViVanChuyen: async (donViData) => {
    try {
      const response = await apiClient.post(
        "/admin/don-vi-van-chuyen/",
        donViData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm đơn vị vận chuyển thất bại",
      };
    }
  },

  // Cập nhật đơn vị vận chuyển
  capNhatDonViVanChuyen: async (id, donViData) => {
    try {
      const response = await apiClient.put(
        `/admin/don-vi-van-chuyen/${id}`,
        donViData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Cập nhật đơn vị vận chuyển thất bại",
      };
    }
  },

  // Khóa/Mở khóa đơn vị vận chuyển
  khoaMoDonViVanChuyen: async (id) => {
    try {
      const response = await apiClient.patch(
        `/admin/don-vi-van-chuyen/${id}/khoa-mo`,
        {},
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Khóa/Mở đơn vị vận chuyển thất bại",
      };
    }
  },

  // Xóa đơn vị vận chuyển
  xoaDonViVanChuyen: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/don-vi-van-chuyen/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa đơn vị vận chuyển thất bại",
      };
    }
  },
};

export default adminService;
