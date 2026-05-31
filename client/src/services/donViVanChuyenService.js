import apiClient from "./apiClient";

const donViVanChuyenService = {
  // Lấy tất cả các đơn vị vận chuyển hoạt động
  layDanhSach: async () => {
    try {
      const response = await apiClient.get("/don-vi-van-chuyen");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách vận chuyển thất bại" };
    }
  },

  // Lấy chi tiết một đơn vị vận chuyển (Admin)
  layChiTiet: async (id) => {
    try {
      const response = await apiClient.get(`/admin/don-vi-van-chuyen/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy chi tiết đơn vị vận chuyển thất bại" };
    }
  },

  // Thêm đơn vị vận chuyển mới (Admin)
  taoMoi: async (data) => {
    try {
      const response = await apiClient.post("/admin/don-vi-van-chuyen", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Thêm đơn vị vận chuyển thất bại" };
    }
  }
};

export default donViVanChuyenService;