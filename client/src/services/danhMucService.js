import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Danh mục (Categories)
const danhMucService = {
  // Lấy tất cả danh mục
  layTatCaDanhMuc: async () => {
    const response = await apiClient.get("/danh-muc");
    return response.data;
  },

  // Tạo danh mục mới (admin)
  themDanhMuc: async (danhMucData) => {
    const response = await apiClient.post("/danh-muc", danhMucData);
    return response.data;
  },

  // Cập nhật danh mục (admin)
  capNhatDanhMuc: async (id, danhMucData) => {
    const response = await apiClient.put(`/danh-muc/${id}`, danhMucData);
    return response.data;
  },

  // Xóa danh mục (admin)
  xoaDanhMuc: async (id) => {
    const response = await apiClient.delete(`/danh-muc/${id}`);
    return response.data;
  },
};

export default danhMucService;
