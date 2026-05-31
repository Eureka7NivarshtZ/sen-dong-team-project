import apiClient from "./apiClient";

const nhanVienService = {
  // Lấy danh sách toàn bộ nhân viên xưởng
  layDanhSach: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/nhan-vien", { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách nhân viên thất bại" };
    }
  },

  // Thêm nhân viên mới vào hệ thống quản trị
  taoNhanVien: async (data) => {
    try {
      const response = await apiClient.post("/admin/nhan-vien/them", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Thêm nhân viên thất bại" };
    }
  },

  // Cập nhật trạng thái hoặc chức vụ nhân viên
  capNhatNhanVien: async (id, data) => {
    try {
      const response = await apiClient.put(`/admin/nhan-vien/${id}`, data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Cập nhật nhân viên thất bại" };
    }
  }
};

export default nhanVienService;