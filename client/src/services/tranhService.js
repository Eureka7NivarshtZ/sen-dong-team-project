import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Tranh (Paintings)
const tranhService = {
  // ========== PUBLIC ENDPOINTS (Khách hàng) ==========

  // Lấy tất cả tranh (public)
  layTatCaTranh: async () => {
    try {
      const response = await apiClient.get("/tranh");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách tranh thất bại",
      };
    }
  },

  // Lấy chi tiết một tranh (public)
  layChiTietTranh: async (id) => {
    try {
      const response = await apiClient.get(`/tranh/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết tranh thất bại",
      };
    }
  },

  // ========== ADMIN ENDPOINTS (Quản lý tranh) ==========

  // Tạo tranh mới (admin)
  taoTranh: async (tranhData) => {
    try {
      const response = await apiClient.post("/admin/tranh", tranhData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo tranh thất bại",
      };
    }
  },

  // Cập nhật tranh (admin)
  capNhatTranh: async (id, tranhData) => {
    try {
      const response = await apiClient.put(`/admin/tranh/${id}`, tranhData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật tranh thất bại",
      };
    }
  },

  // Ẩn tranh (admin) - Thay vì xóa vĩnh viễn
  anTranh: async (id) => {
    try {
      const response = await apiClient.put(`/admin/tranh/${id}/an`, {});
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Ẩn tranh thất bại",
      };
    }
  },

  // Xóa tranh (admin)
  xoaTranh: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/tranh/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa tranh thất bại",
      };
    }
  },

  // ========== HÌNH ẢNH TRANH ==========

  // Thêm hình ảnh cho tranh (admin)
  themHinhAnhTranh: async (tranhId, hinhAnhData) => {
    try {
      // Nếu có file upload, sử dụng FormData
      const formData = new FormData();
      if (hinhAnhData.file) {
        formData.append("file", hinhAnhData.file);
      }
      if (hinhAnhData.duongDan) {
        formData.append("duongDan", hinhAnhData.duongDan);
      }

      const response = await apiClient.post(
        `/admin/tranh/${tranhId}/hinh-anh`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Thêm hình ảnh thất bại",
      };
    }
  },

  // Cập nhật hình ảnh tranh (admin)
  capNhatHinhAnhTranh: async (id, hinhAnhData) => {
    try {
      const formData = new FormData();
      if (hinhAnhData.file) {
        formData.append("file", hinhAnhData.file);
      }
      if (hinhAnhData.duongDan) {
        formData.append("duongDan", hinhAnhData.duongDan);
      }

      const response = await apiClient.put(
        `/admin/tranh/hinh-anh/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật hình ảnh thất bại",
      };
    }
  },

  // Đặt hình ảnh chính (admin)
  datAnhChinh: async (id) => {
    try {
      const response = await apiClient.put(
        `/admin/tranh/hinh-anh/${id}/chinh`,
        {},
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Đặt hình ảnh chính thất bại",
      };
    }
  },

  // Xóa hình ảnh tranh (admin)
  xoaHinhAnhTranh: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/tranh/hinh-anh/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa hình ảnh thất bại",
      };
    }
  },
};

export default tranhService;
