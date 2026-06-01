import apiClient from "./apiClient";

const nhanVienService = {
  layDanhSach: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/nhan-vien", { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy danh sách nhân viên thất bại" };
    }
  },

  layChiTiet: async (id) => {
    try {
      const response = await apiClient.get(`/admin/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy chi tiết nhân viên thất bại" };
    }
  },

  taoNhanVien: async (data) => {
    try {
      const response = await apiClient.post("/admin/nhan-vien/them", data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Thêm nhân viên mới thất bại" };
    }
  },

  capNhatNhanVien: async (id, data) => {
    try {
      const response = await apiClient.put(`/admin/nhan-vien/${id}`, data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Cập nhật thông tin nhân viên thất bại" };
    }
  },

  xoaNhanVien: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/nhan-vien/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Xóa nhân viên thất bại" };
    }
  }
};

export default nhanVienService;