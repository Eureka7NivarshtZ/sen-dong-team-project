import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Tác giả (Authors)
const tacGiaService = {
  // ========== PUBLIC ENDPOINTS ==========

  // Lấy tất cả tác giả
  layTatCaTacGia: async () => {
    try {
      const response = await apiClient.get("/tac-gia");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách tác giả thất bại",
      };
    }
  },

  // ========== ADMIN ENDPOINTS ==========

  // Tạo tác giả mới (admin)
  themTacGia: async (tacGiaData) => {
    try {
      const response = await apiClient.post("/tac-gia", tacGiaData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm tác giả thất bại",
      };
    }
  },

  // Cập nhật tác giả (admin)
  capNhatTacGia: async (id, tacGiaData) => {
    try {
      const response = await apiClient.put(`/tac-gia/${id}`, tacGiaData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật tác giả thất bại",
      };
    }
  },

  // Xóa tác giả (admin)
  xoaTacGia: async (id) => {
    try {
      const response = await apiClient.delete(`/tac-gia/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa tác giả thất bại",
      };
    }
  },
};

export default tacGiaService;
