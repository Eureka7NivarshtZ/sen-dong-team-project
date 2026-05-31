import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Tranh (Paintings)
const tranhService = {
  // ========== PUBLIC ENDPOINTS (Khách hàng) ==========

  // Lấy tất cả tranh (public)
  layTatCaTranh: async () => {
    const response = await apiClient.get("/tranh");
    return response.data;
  },

  // Lấy chi tiết một tranh (public)
  layChiTietTranh: async (id) => {
    const response = await apiClient.get(`/tranh/${id}`);
    return response.data;
  },

  // ========== ADMIN ENDPOINTS (Quản lý tranh) ==========

  // Tạo tranh mới (admin)
  taoTranh: async (tranhData) => {
    const response = await apiClient.post("/tranh", tranhData);
    return response.data;
  },

  // Cập nhật tranh (admin)
  capNhatTranh: async (id, tranhData) => {
    const response = await apiClient.put(`/tranh/${id}`, tranhData);
    return response.data;
  },

  // Xóa tranh (admin)
  xoaTranh: async (id) => {
    const response = await apiClient.delete(`/tranh/${id}`);
    return response.data;
  },

  // ========== HÌNH ẢNH TRANH ==========

  // Thêm hình ảnh cho tranh (admin)
  themHinhAnhTranh: async (tranhId, hinhAnhData) => {
    // Nếu có file upload, sử dụng FormData
    const formData = new FormData();
    if (hinhAnhData.file) {
      formData.append("file", hinhAnhData.file);
    }
    if (hinhAnhData.duongDan) {
      formData.append("duongDan", hinhAnhData.duongDan);
    }

    const response = await apiClient.post(
      `/tranh/${tranhId}/hinh-anh`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Cập nhật hình ảnh tranh (admin)
  capNhatHinhAnhTranh: async (id, hinhAnhData) => {
    const formData = new FormData();
    if (hinhAnhData.file) {
      formData.append("file", hinhAnhData.file);
    }
    if (hinhAnhData.duongDan) {
      formData.append("duongDan", hinhAnhData.duongDan);
    }

    const response = await apiClient.put(`/tranh/hinh-anh/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Đặt hình ảnh chính (admin)
  datAnhChinh: async (id) => {
    const response = await apiClient.put(`/tranh/hinh-anh/${id}/chinh`, {});
    return response.data;
  },

  // Xóa hình ảnh tranh (admin)
  xoaHinhAnhTranh: async (id) => {
    const response = await apiClient.delete(`/tranh/hinh-anh/${id}`);
    return response.data;
  },
};

export default tranhService;
