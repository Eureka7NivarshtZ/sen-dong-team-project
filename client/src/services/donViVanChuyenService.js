import apiClient from "./apiClient";

const donViVanChuyenService = {
  // Khách hàng dùng — chỉ lấy đơn vị đang hoạt động
  layDanhSach: async () => {
    try {
      const response = await apiClient.get("/don-vi-van-chuyen/hoat-dong");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách vận chuyển thất bại",
      };
    }
  },

  // Admin — lấy tất cả (kể cả tạm dừng)
  layDanhSachAdmin: async () => {
    try {
      const response = await apiClient.get("/don-vi-van-chuyen");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách vận chuyển thất bại",
      };
    }
  },

  layChiTiet: async (id) => {
    try {
      const response = await apiClient.get(`/don-vi-van-chuyen/${id}`);
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

  taoMoi: async (data) => {
    try {
      const response = await apiClient.post("/don-vi-van-chuyen", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm đơn vị vận chuyển thất bại",
      };
    }
  },

  capNhat: async (id, data) => {
    try {
      const response = await apiClient.put(`/don-vi-van-chuyen/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Cập nhật đơn vị vận chuyển thất bại",
      };
    }
  },

  xoa: async (id) => {
    try {
      const response = await apiClient.delete(`/don-vi-van-chuyen/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa đơn vị vận chuyển thất bại",
      };
    }
  },

  // Bật/tắt nhanh — gọi endpoint toggle riêng nếu có, fallback về capNhat
  toggleHoatDong: async (id) => {
    try {
      const response = await apiClient.patch(`/don-vi-van-chuyen/${id}/toggle`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật trạng thái thất bại",
      };
    }
  },
};

export default donViVanChuyenService;
