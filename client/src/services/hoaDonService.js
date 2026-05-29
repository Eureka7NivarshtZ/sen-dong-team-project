import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Hóa đơn (Invoices)
const hoaDonService = {
  // Lấy tất cả hóa đơn
  layTatCaHoaDon: async (params = {}) => {
    try {
      const response = await apiClient.get("/hoa-don/", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách hóa đơn thất bại",
      };
    }
  },

  // Lấy chi tiết hóa đơn
  layChiTietHoaDon: async (id) => {
    try {
      const response = await apiClient.get(`/hoa-don/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết hóa đơn thất bại",
      };
    }
  },

  // Tạo hóa đơn
  taoHoaDon: async (hoaDonData) => {
    try {
      const response = await apiClient.post("/hoa-don/", hoaDonData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo hóa đơn thất bại",
      };
    }
  },

  // Hủy hóa đơn
  huyHoaDon: async (id) => {
    try {
      const response = await apiClient.patch(`/hoa-don/${id}/huy`, {});
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy hóa đơn thất bại",
      };
    }
  },
};

export default hoaDonService;
