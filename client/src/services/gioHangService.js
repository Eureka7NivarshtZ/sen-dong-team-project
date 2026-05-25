import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Giỏ hàng (Shopping Cart)
const gioHangService = {
  // Lấy giỏ hàng của tôi
  layGioHangCuaToi: async () => {
    try {
      const response = await apiClient.get("/gio-hang");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy giỏ hàng thất bại",
      };
    }
  },

  // Thêm vào giỏ hàng
  themVaoGioHang: async (tranhId, soLuong = 1) => {
    try {
      const response = await apiClient.post("/gio-hang/them", {
        tranhId,
        soLuong,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm vào giỏ hàng thất bại",
      };
    }
  },

  // Cập nhật số lượng item trong giỏ hàng
  capNhatSoLuong: async (gioHangChiTietId, soLuong) => {
    try {
      const response = await apiClient.put(`/gio-hang/${gioHangChiTietId}`, {
        soLuong,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật số lượng thất bại",
      };
    }
  },

  // Xóa một item khỏi giỏ hàng
  xoaKhoiGioHang: async (gioHangChiTietId) => {
    try {
      const response = await apiClient.delete(`/gio-hang/${gioHangChiTietId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa từ giỏ hàng thất bại",
      };
    }
  },

  // Xóa tất cả items trong giỏ hàng
  xoaTatCaGioHang: async () => {
    try {
      const response = await apiClient.delete("/gio-hang");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa toàn bộ giỏ hàng thất bại",
      };
    }
  },
};

export default gioHangService;
