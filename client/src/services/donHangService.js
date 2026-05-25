import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Đơn hàng (Orders)
const donHangService = {
  // ========== CUSTOMER ENDPOINTS ==========

  // Tạo đơn hàng mới
  taoDonHang: async (donHangData) => {
    try {
      const response = await apiClient.post("/don-hang/them", donHangData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo đơn hàng thất bại",
      };
    }
  },

  // Xem đơn hàng của tôi
  xemDonCuaToi: async () => {
    try {
      const response = await apiClient.get("/don-hang/cua-toi");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy đơn hàng thất bại",
      };
    }
  },

  // Xem chi tiết một đơn hàng của tôi
  xemChiTietDonCuaToi: async (id) => {
    try {
      const response = await apiClient.get(`/don-hang/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại",
      };
    }
  },

  // Hủy đơn hàng của tôi
  huyDonCuaToi: async (id) => {
    try {
      const response = await apiClient.put(`/don-hang/${id}/huy`, {});
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy đơn hàng thất bại",
      };
    }
  },

  // ========== ADMIN ENDPOINTS ==========

  // Xem tất cả đơn hàng (admin)
  xemTatCaDonHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/don-hang", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách đơn hàng thất bại",
      };
    }
  },

  // Xem chi tiết bất kỳ đơn hàng (admin)
  xemChiTietDonBatKy: async (id) => {
    try {
      const response = await apiClient.get(`/admin/don-hang/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại",
      };
    }
  },

  // Cập nhật trạng thái đơn hàng (admin)
  capNhatTrangThaiDon: async (id, trangThaiMoi) => {
    try {
      const response = await apiClient.put(`/admin/don-hang/${id}/trang-thai`, {
        trangThaiMoi,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật trạng thái thất bại",
      };
    }
  },

  // Hủy đơn bất kỳ (admin)
  huyDonBatKy: async (id) => {
    try {
      const response = await apiClient.put(`/admin/don-hang/${id}/huy`, {});
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy đơn hàng thất bại",
      };
    }
  },
};

export default donHangService;
