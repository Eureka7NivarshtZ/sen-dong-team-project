import apiClient from "./apiClient";

const chamSocKhachHangService = {
  // Khách hàng gửi lời nhắn liên hệ góp ý
  guiLienHeMoi: async (data) => {
    try {
      const response = await apiClient.post("/cham-soc-khach-hang/gui", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi liên hệ thất bại" };
    }
  },

  // Admin xem toàn bộ danh sách khách hàng cần hỗ trợ
  layDanhSachTinNhan: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/cham-soc-khach-hang", { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách tin nhắn thất bại" };
    }
  },

  // Admin gửi câu trả lời phản hồi mail/chat cho khách
  traLoiKhachHang: async (id, noiDungPhanHoi) => {
    try {
      const response = await apiClient.post(`/admin/cham-soc-khach-hang/${id}/tra-loi`, { noiDungPhanHoi });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi câu trả lời thất bại" };
    }
  }
};

export default chamSocKhachHangService;