import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Vận đơn (Shipment)
const vanDonService = {
  // Tạo vận đơn
  taoVanDon: async (donHangId, vanDonData) => {
    try {
      const response = await apiClient.post(
        `/admin/van-don/don-hang/${donHangId}`,
        vanDonData,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo vận đơn thất bại",
      };
    }
  },

  // Lấy tất cả vận đơn
  layTatCaVanDon: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/van-don/", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách vận đơn thất bại",
      };
    }
  },

  // Lấy chi tiết vận đơn
  layChiTietVanDon: async (id) => {
    try {
      const response = await apiClient.get(`/admin/van-don/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết vận đơn thất bại",
      };
    }
  },

  // Cập nhật vận đơn
  capNhatVanDon: async (id, vanDonData) => {
    try {
      const response = await apiClient.put(`/admin/van-don/${id}`, vanDonData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật vận đơn thất bại",
      };
    }
  },

  // Cập nhật trạng thái vận đơn
  capNhatTrangThaiVanDon: async (id, trangThaiMoi) => {
    try {
      const response = await apiClient.patch(
        `/admin/van-don/${id}/trang-thai`,
        {
          trangThaiMoi,
        },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Cập nhật trạng thái vận đơn thất bại",
      };
    }
  },

  // Xóa vận đơn
  xoaVanDon: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/van-don/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Xóa vận đơn thất bại",
      };
    }
  },
};

export default vanDonService;
