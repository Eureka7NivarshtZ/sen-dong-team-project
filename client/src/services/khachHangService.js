import apiClient from "./apiClient";

const khachHangService = {
  // Xem thông tin cá nhân của khách hàng đang đăng nhập
  layHoSoCuaToi: async () => {
    try {
      const response = await apiClient.get("/khach-hang/ho-so");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy thông tin cá nhân thất bại",
      };
    }
  },

  // Cập nhật thông tin cá nhân (SĐT, Địa chỉ...)
  capNhatHoSo: async (data) => {
    try {
      const response = await apiClient.put("/khach-hang/cap-nhat", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật thông tin thất bại",
      };
    }
  },

  // Quản lý danh sách khách hàng (Dành cho Admin)
  layDanhSachKhachHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/khach-hang", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Lấy danh sách khách hàng thất bại",
      };
    }
  },
};

export default khachHangService;
