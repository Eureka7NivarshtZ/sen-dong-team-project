import apiClient from "./apiClient";

const khuyenMaiService = {
  // Khách hàng — kiểm tra mã (route: POST /khuyen-mai/kiem-tra)
  kiemTraMaGiamGia: async (ma, tong_tien = 0) => {
    try {
      const response = await apiClient.post("/khuyen-mai/kiem-tra", {
        ma,
        tong_tien,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Mã giảm giá không hợp lệ",
      };
    }
  },

  // Admin — lấy danh sách (route: GET /khuyen-mai)
  layDanhSach: async (params = {}) => {
    try {
      const response = await apiClient.get("/khuyen-mai", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách khuyến mãi thất bại",
      };
    }
  },

  // Admin — xem chi tiết (route: GET /khuyen-mai/:id)
  layChiTiet: async (id) => {
    try {
      const response = await apiClient.get(`/khuyen-mai/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy chi tiết khuyến mãi thất bại",
      };
    }
  },

  // Admin — tạo mới (route: POST /khuyen-mai)
  taoMoi: async (data) => {
    try {
      const response = await apiClient.post("/khuyen-mai", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo khuyến mãi thất bại",
      };
    }
  },

  // Admin — cập nhật (route: PUT /khuyen-mai/:id)
  capNhat: async (id, data) => {
    try {
      const response = await apiClient.put(`/khuyen-mai/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật khuyến mãi thất bại",
      };
    }
  },

  // Admin — xóa (route: DELETE /khuyen-mai/:id)
  xoa: async (id) => {
    try {
      const response = await apiClient.delete(`/khuyen-mai/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa khuyến mãi thất bại",
      };
    }
  },
};

export default khuyenMaiService;
