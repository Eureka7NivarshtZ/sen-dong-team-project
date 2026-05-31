import apiClient from "./apiClient";

const gioHangService = {
  // 1. Lấy tất cả sản phẩm trong giỏ hàng
  xemGioHang: async () => {
    try {
      const response = await apiClient.get("/gio-hang");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy thông tin giỏ hàng thất bại",
      };
    }
  },

  // 2. Thêm sản phẩm vào giỏ hàng
  themVaoGioHang: async (tranh_id, so_luong) => {
    try {
      const response = await apiClient.post("/gio-hang/them", { tranh_id, so_luong });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm sản phẩm vào giỏ thất bại",
      };
    }
  },

  // 3. Cập nhật số lượng (Đã sửa theo đúng route: router.put("/:id"))
  capNhatSoLuong: async (id, so_luong) => {
    try {
      const response = await apiClient.put(`/gio-hang/${id}`, { so_luong });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật số lượng thất bại",
      };
    }
  },

  // 4. Xóa một tác phẩm ra khỏi giỏ (Đã sửa theo đúng route: router.delete("/:id"))
  xoaKhoiGioHang: async (id) => {
    try {
      // Đường dẫn trực tiếp trùng khớp với Backend
      const response = await apiClient.delete(`/gio-hang/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa sản phẩm thất bại",
      };
    }
  }
};

export default gioHangService;