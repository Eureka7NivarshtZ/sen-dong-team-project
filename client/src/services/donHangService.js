import apiClient from "./apiClient";

const donHangService = {
  // --- CLIENT ENDPOINTS (Khách hàng) ---
  taoDonHang: async (donHangData) => {
    try {
      const response = await apiClient.post("/don-hang/them", donHangData);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Tạo đơn hàng thất bại" };
    }
  },

  xemDonCuaToi: async () => {
    try {
      const response = await apiClient.get("/don-hang/cua-toi");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy đơn hàng thất bại" };
    }
  },

  xemChiTietDonCuaToi: async (id) => {
    try {
      const response = await apiClient.get(`/don-hang/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại" };
    }
  },

  huyDonCuaToi: async (id) => {
    try {
      const response = await apiClient.put(`/don-hang/${id}/huy`, {});
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Hủy đơn hàng thất bại" };
    }
  },

  // --- ADMIN ENDPOINTS (Quản trị viên duyệt đơn) ---
  xemTatCaDonHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/don-hang", { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách đơn hàng thất bại" };
    }
  },

  xemChiTietDonBatKy: async (id) => {
    try {
      const response = await apiClient.get(`/admin/don-hang/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại" };
    }
  },

  capNhatTrangThaiDon: async (id, trangThaiMoi) => {
    try {
      const response = await apiClient.put(`/admin/don-hang/${id}/trang-thai`, { trangThaiMoi });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Cập nhật trạng thái thất bại" };
    }
  },

  huyDonBatKy: async (id) => {
    try {
      const response = await apiClient.put(`/admin/don-hang/${id}/huy`, {});
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Hủy đơn hàng thất bại" };
    }
  }
};

export default donHangService;