import apiClient from "./apiClient";

const chamSocKhachHangService = {
  // 1. Khách hàng gửi lời nhắn hỗ trợ mới
  guiTinNhanMoi: async (data) => {
    try {
      const response = await apiClient.post("/cham-soc-khach-hang/gui", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi hỗ trợ thất bại" };
    }
  },

  // 2. Khách hàng xem lịch sử hỗ trợ
  layLichSuCuaToi: async () => {
    try {
      const response = await apiClient.get("/cham-soc-khach-hang/cua-toi");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy lịch sử thất bại" };
    }
  },

  // 3. Admin lấy danh sách tin nhắn hỗ trợ (Đường dẫn chuẩn theo app.js của ông)
  layDanhSachTinNhanAdmin: async () => {
    try {
      const response = await apiClient.get("/cham-soc-khach-hang/admin/danh-sach");
      return response.data;
    } catch (error) {
      // Hiện thẳng lỗi chi tiết từ database hoặc hệ thống nếu có gãy luồng
      return { success: false, error: error.response?.data?.error || "Lỗi gọi kết nối từ Service Admin lên Server" };
    }
  },

  // 4. Admin gửi nội dung phản hồi cho khách
  traLoiKhachHangAdmin: async (id, noiDungPhanHoi) => {
    try {
      const response = await apiClient.post(`/cham-soc-khach-hang/admin/${id}/tra-loi`, { noiDungPhanHoi });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi phản hồi thất bại" };
    }
  }
};

export default chamSocKhachHangService;