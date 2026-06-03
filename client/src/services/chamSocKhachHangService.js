import apiClient from "./apiClient";

const chamSocKhachHangService = {
  guiTinNhanMoi: async (data) => {
    try {
      const response = await apiClient.post("/cham-soc-khach-hang/gui", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi hỗ trợ thất bại" };
    }
  },

  layLichSuCuaToi: async () => {
    try {
      const response = await apiClient.get("/cham-soc-khach-hang/cua-toi");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy lịch sử thất bại" };
    }
  },

  // Hàm mới cho khách hàng chat tiếp
  userPhanHoiTiep: async (id, message) => {
    try {
      const response = await apiClient.post(`/cham-soc-khach-hang/${id}/user-tra-loi`, { message });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Gửi tin nhắn thất bại" };
    }
  },

  layDanhSachTinNhanAdmin: async () => {
    try {
      const response = await apiClient.get("/cham-soc-khach-hang/admin/danh-sach");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách thất bại" };
    }
  },

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