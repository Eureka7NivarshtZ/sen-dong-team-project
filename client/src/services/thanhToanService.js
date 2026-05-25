import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Thanh toán (Payments)
const thanhToanService = {
  // Lấy tất cả thanh toán
  layTatCaThanhToan: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/thanh-toan/", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách thanh toán thất bại",
      };
    }
  },

  // Lấy chi tiết thanh toán
  layChiTietThanhToan: async (id) => {
    try {
      const response = await apiClient.get(`/admin/thanh-toan/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy chi tiết thanh toán thất bại",
      };
    }
  },

  // Tạo thanh toán
  taoThanhToan: async (thanhToanData) => {
    try {
      const response = await apiClient.post(
        "/admin/thanh-toan/",
        thanhToanData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo thanh toán thất bại",
      };
    }
  },

  // Cập nhật trạng thái thanh toán
  capNhatTrangThaiThanhToan: async (id, trangThaiMoi) => {
    try {
      const response = await apiClient.patch(
        `/admin/thanh-toan/${id}/trang-thai`,
        { trangThaiMoi },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Cập nhật trạng thái thanh toán thất bại",
      };
    }
  },
};

export default thanhToanService;
