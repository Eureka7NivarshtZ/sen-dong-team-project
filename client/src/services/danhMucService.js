import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Danh mục (Categories)
const danhMucService = {
  // ========== PUBLIC ENDPOINTS ==========

  // Lấy tất cả danh mục
  layTatCaDanhMuc: async () => {
    try {
      const response = await apiClient.get("/danh-muc");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh mục thất bại",
      };
    }
  },

  // ========== ADMIN ENDPOINTS ==========

  // Tạo danh mục mới (admin)
  themDanhMuc: async (danhMucData) => {
    try {
      const response = await apiClient.post("/admin/danh-muc", danhMucData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm danh mục thất bại",
      };
    }
  },

  // Cập nhật danh mục (admin)
  capNhatDanhMuc: async (id, danhMucData) => {
    try {
      const response = await apiClient.put(
        `/admin/danh-muc/${id}`,
        danhMucData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật danh mục thất bại",
      };
    }
  },

  // Xóa danh mục (admin)
  xoaDanhMuc: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/danh-muc/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa danh mục thất bại",
      };
    }
  },
};

export default danhMucService;
