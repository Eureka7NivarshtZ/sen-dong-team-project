import apiClient from "./apiClient";

const khuyenMaiService = {
  // Client áp dụng coupon kiểm tra giảm giá
  kiemTraMaGiamGia: async (code) => {
    try {
      const response = await apiClient.post("/khuyen-mai/ap-dung", { code });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Mã giảm giá không hợp lệ" };
    }
  },

  // Admin quản lý danh sách chương trình khuyến mãi
  layDanhSachMa: async () => {
    try {
      const response = await apiClient.get("/admin/khuyen-mai");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách mã thất bại" };
    }
  },

  taoMaMoi: async (data) => {
    try {
      const response = await apiClient.post("/admin/khuyen-mai/them", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Tạo mã khuyến mãi thất bại" };
    }
  },

  xoaMa: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/khuyen-mai/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Xóa mã khuyến mãi thất bại" };
    }
  }
};

export default khuyenMaiService;